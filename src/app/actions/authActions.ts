'use server'

import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { hashPassword, verifyPassword, signToken, verifyToken } from '@/lib/auth'

const isDummyDb = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes('johndoe')


export interface ActionResponse<T = any> {
  success: boolean
  error?: string
  data?: T
}

// 1. Sign Up Action
export async function signUpAction(
  formData: Record<string, string>
): Promise<ActionResponse> {
  const { name, email, password, confirmPassword } = formData

  if (isDummyDb) {
    return { success: false, error: 'Database connection failed. Creating account locally instead.' }
  }


  if (!name || !email || !password || !confirmPassword) {
    return { success: false, error: 'All fields are required.' }
  }

  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match.' }
  }

  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' }
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return { success: false, error: 'An account with this email already exists.' }
    }

    const passwordHash = await hashPassword(password)
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    })

    return { success: true }
  } catch (err) {
    console.error('Sign Up Error:', err)
    return { success: false, error: 'Database connection failed. Creating account locally instead.' }
  }
}

// 2. Login Action
export async function loginAction(
  formData: Record<string, any>
): Promise<ActionResponse> {
  const { email, password, rememberMe } = formData

  if (isDummyDb) {
    return { success: false, error: 'Database connection failed. Continuing in local offline mode.' }
  }


  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' }
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return { success: false, error: 'Invalid email or password.' }
    }

    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) {
      return { success: false, error: 'Invalid email or password.' }
    }

    // Sign session token
    const token = signToken({ id: user.id, email: user.email }, rememberMe)

    // Set secure cookie
    const cookieStore = await cookies()
    cookieStore.set('dsa_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : undefined, // 30 days or session duration
    })

    return {
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        dailyGoal: user.dailyGoal,
        currentYear: user.currentYear,
        createdDate: user.createdAt.toISOString().split('T')[0],
      },
    }
  } catch (err) {
    console.error('Login Error:', err)
    return { success: false, error: 'Database connection failed. Continuing in local offline mode.' }
  }
}

// 3. Logout Action
export async function logoutAction(): Promise<ActionResponse> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('dsa_session')
    return { success: true }
  } catch (err) {
    return { success: false, error: 'Logout failed.' }
  }
}

// 4. Get Current User Session Action
export async function getCurrentUserAction(): Promise<ActionResponse> {
  if (isDummyDb) {
    return { success: false, error: 'Database connection offline.' }
  }
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('dsa_session')
    if (!sessionCookie) {
      return { success: false, error: 'No active session.' }
    }

    const payload = verifyToken(sessionCookie.value)
    if (!payload || !payload.id) {
      return { success: false, error: 'Invalid session token.' }
    }

    const user = await prisma.user.findUnique({ where: { id: payload.id } })
    if (!user) {
      return { success: false, error: 'User does not exist.' }
    }

    return {
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        dailyGoal: user.dailyGoal,
        currentYear: user.currentYear,
        createdDate: user.createdAt.toISOString().split('T')[0],
      },
    }
  } catch (err) {
    return { success: false, error: 'Session fetch failed.' }
  }
}

// 5. Reset Password Action
export async function resetPasswordAction(
  formData: Record<string, string>
): Promise<ActionResponse> {
  const { email, password, confirmPassword } = formData

  if (isDummyDb) {
    return { success: false, error: 'Failed to reset password. Check connection.' }
  }


  if (!email || !password || !confirmPassword) {
    return { success: false, error: 'All fields are required.' }
  }

  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match.' }
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return { success: false, error: 'No account registered with this email.' }
    }

    const passwordHash = await hashPassword(password)
    await prisma.user.update({
      where: { email },
      data: { passwordHash },
    })

    return { success: true }
  } catch (err) {
    return { success: false, error: 'Failed to reset password. Check connection.' }
  }
}
