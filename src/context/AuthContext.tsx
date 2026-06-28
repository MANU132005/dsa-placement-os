'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

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
  login: (email: string, name?: string) => Promise<void>
  loginWithOAuth: (provider: 'google' | 'github') => Promise<void>
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

  // Load user session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('dsa_user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
      setIsLoading(false)
    }
  }, [])

  // Route protection route guard
  useEffect(() => {
    if (isLoading) return

    const isPublicRoute = pathname === '/login'
    
    if (!user && !isPublicRoute) {
      router.push('/login')
    } else if (user && !user.isOnboarded && pathname !== '/onboarding') {
      router.push('/onboarding')
    } else if (user && user.isOnboarded && isPublicRoute) {
      router.push('/dashboard')
    }
  }, [user, isLoading, pathname, router])

  // Email/Password login mock
  const login = async (email: string, name: string = 'User') => {
    setIsLoading(true)
    const mockUser: UserProfile = {
      id: crypto.randomUUID(),
      name,
      email,
      profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      provider: 'email',
      createdDate: new Date().toISOString().split('T')[0],
      dailyGoal: 10,
      currentYear: '3rd Year',
      isOnboarded: false,
    }
    setUser(mockUser)
    localStorage.setItem('dsa_user', JSON.stringify(mockUser))
    setIsLoading(false)
    router.push('/onboarding')
  }

  // OAuth Login Mock (Google/Github)
  const loginWithOAuth = async (provider: 'google' | 'github') => {
    setIsLoading(true)
    const name = provider === 'google' ? 'Google Developer' : 'GitHub Engineer'
    const email = provider === 'google' ? 'google.dev@placement.os' : 'github.eng@placement.os'
    const photo = provider === 'google'
      ? 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=faces'
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces'

    const mockUser: UserProfile = {
      id: crypto.randomUUID(),
      name,
      email,
      profilePhoto: photo,
      provider,
      createdDate: new Date().toISOString().split('T')[0],
      dailyGoal: 10,
      currentYear: '3rd Year',
      isOnboarded: false,
    }
    setUser(mockUser)
    localStorage.setItem('dsa_user', JSON.stringify(mockUser))
    setIsLoading(false)
    router.push('/onboarding')
  }

  // Logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem('dsa_user')
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
        loginWithOAuth,
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
