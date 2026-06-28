'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { useAuth } from '@/context/AuthContext'
import { Loader2 } from 'lucide-react'

export default function ClientShellWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isLoading } = useAuth()

  const isPublicOrOnboarding = 
    pathname === '/login' || 
    pathname === '/signup' || 
    pathname === '/forgot-password' || 
    pathname === '/onboarding'

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (isPublicOrOnboarding) {
    return <div className="w-full min-h-screen">{children}</div>
  }

  return (
    <>
      <Sidebar />
      <main className="pl-64 flex-1 flex flex-col min-h-screen">
        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </>
  )
}
