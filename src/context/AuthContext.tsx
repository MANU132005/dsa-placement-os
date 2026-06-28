'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  loginAction, 
  signUpAction, 
  logoutAction, 
  getCurrentUserAction 
} from '@/app/actions/authActions'

export interface UserProfile {
  id: string
  name: string
  email: string
  profilePhoto: string
  provider: string
  createdDate: string
  dailyGoal: number
  currentYear: string
  isOnboarded: boolean
}

interface AuthContextType {
  user: UserProfile | null
  isLoading: boolean
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>
  logout: () => void
  completeOnboarding: (
    dailyGoal: number,
    targetCompanies: string[],
    currentYear: string,
    preferredTheme: 'light' | 'dark'
  ) => void
  updateProfile: (
    name: string,
    currentYear: string,
    dailyGoal: number,
    targetCompanies: string[]
  ) => void
  deleteAccount: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const router = useRouter()
  const pathname = usePathname()

  // Load user session from server-side HttpOnly cookie on mount
  useEffect(() => {
    async function initSession() {
      try {
        const res = await getCurrentUserAction()
        if (res.success && res.data) {
          const profile: UserProfile = {
            ...res.data,
            profilePhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
            provider: 'email',
            isOnboarded: true, // assume onboarded once verified from server database
          }
          setUser(profile)
        } else {
          // Fallback to check localStorage for guest mode if database unconfigured
          const storedUser = localStorage.getItem('dsa_user')
          if (storedUser) {
            setUser(JSON.parse(storedUser))
          }
        }
      } catch (err) {
        console.error('Session init error:', err)
      } finally {
        setIsLoading(false)
      }
    }
    initSession()
  }, [])

  // Route protection route guard
  useEffect(() => {
    if (isLoading) return

    const isPublicRoute = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password'
    
    if (!user && !isPublicRoute) {
      router.push('/login')
    } else if (user && !user.isOnboarded && pathname !== '/onboarding') {
      router.push('/onboarding')
    } else if (user && user.isOnboarded && isPublicRoute) {
      router.push('/dashboard')
    }
  }, [user, isLoading, pathname, router])

  // Email/Password login
  const login = async (email: string, password: string, rememberMe: boolean) => {
    setIsLoading(true)
    try {
      const res = await loginAction({ email, password, rememberMe })
      if (res.success && res.data) {
        const profile: UserProfile = {
          ...res.data,
          profilePhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
          provider: 'email',
          isOnboarded: true, // assume onboarded if fetched from real database
        }
        setUser(profile)
        localStorage.setItem('dsa_user', JSON.stringify(profile))
        router.push('/dashboard')
      } else {
        // Fallback simulated authentication for local development when DB is unconfigured
        if (res.error?.includes('failed') || res.error?.includes('offline')) {
          // Offline local mode fallback
          const mockUser: UserProfile = {
            id: 'local-guest-id',
            name: email.split('@')[0],
            email,
            profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
            provider: 'email',
            createdDate: new Date().toISOString().split('T')[0],
            dailyGoal: 10,
            currentYear: '3rd Year',
            isOnboarded: false, // forces onboarding on first login
          }
          setUser(mockUser)
          localStorage.setItem('dsa_user', JSON.stringify(mockUser))
          router.push('/onboarding')
        } else {
          throw new Error(res.error || 'Authentication failed.')
        }
      }
    } catch (err: any) {
      setIsLoading(false)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Logout
  const logout = async () => {
    setIsLoading(true)
    try {
      await logoutAction()
    } catch (err) {}
    
    setUser(null)
    localStorage.removeItem('dsa_user')
    setIsLoading(false)
    router.push('/login')
  }

  // Onboarding completion
  const completeOnboarding = (
    dailyGoal: number,
    targetCompanies: string[],
    currentYear: string,
    preferredTheme: 'light' | 'dark'
  ) => {
    if (!user) return
    const updatedUser: UserProfile = {
      ...user,
      dailyGoal,
      currentYear,
      isOnboarded: true,
    }
    setUser(updatedUser)
    localStorage.setItem('dsa_user', JSON.stringify(updatedUser))
    localStorage.setItem('dsa_target_companies', JSON.stringify(targetCompanies))
    localStorage.setItem('dsa_theme', preferredTheme)
    
    // Apply theme
    if (preferredTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    router.push('/dashboard')
  }

  // Update profile
  const updateProfile = (
    name: string,
    currentYear: string,
    dailyGoal: number,
    targetCompanies: string[]
  ) => {
    if (!user) return
    const updatedUser: UserProfile = {
      ...user,
      name,
      currentYear,
      dailyGoal,
    }
    setUser(updatedUser)
    localStorage.setItem('dsa_user', JSON.stringify(updatedUser))
    localStorage.setItem('dsa_target_companies', JSON.stringify(targetCompanies))
  }

  // Delete account
  const deleteAccount = () => {
    setUser(null)
    localStorage.clear()
    router.push('/login')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        completeOnboarding,
        updateProfile,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
