import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'placement-os-super-secret-key-998877'

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

// Compare password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Sign JWT Token
export function signToken(payload: object, rememberMe: boolean = false): string {
  const expiresIn = rememberMe ? '30d' : '1d'
  return jwt.sign(payload, JWT_SECRET, { expiresIn })
}

// Verify JWT Token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (err) {
    return null
  }
}
