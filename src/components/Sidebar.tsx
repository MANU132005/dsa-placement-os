'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Database, 
  RefreshCw, 
  Search, 
  BookOpen, 
  Building2, 
  LineChart, 
  Flame, 
  Settings, 
  FileText, 
  PenTool, 
  Code,
  User,
  LogOut,
  Trophy
} from 'lucide-react'
import { useData } from '@/context/DataContext'
import { useAuth } from '@/context/AuthContext'

export const Sidebar: React.FC = () => {
  const pathname = usePathname()
  const { problems } = useData()
  const { user, logout } = useAuth()

  const solvedCount = problems.filter((p) => p.status !== null && p.status !== undefined).length
  const totalCount = 307
  const percentComplete = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Mission Infosys SP 2027', path: '/mission-infosys-sp-2027', icon: Trophy },
    { name: 'Problems', path: '/problems', icon: Database },
    { name: 'Today\'s Revision', path: '/revision', icon: RefreshCw },
    { name: 'Search Engine', path: '/search', icon: Search },
    { name: 'Pattern Encyclopedia', path: '/patterns', icon: BookOpen },
    { name: 'Company Readiness', path: '/companies', icon: Building2 },
    { name: 'Mock OA Tracker', path: '/mock-oa', icon: FileText },
    { name: 'Mistake Journal', path: '/mistakes', icon: PenTool },
    { name: 'CS Fundamentals', path: '/cs-fundamentals', icon: Code },
    { name: 'Interview Journal', path: '/interview', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ]

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border flex flex-col justify-between p-4 z-30 transition-colors duration-200">
      <div className="flex flex-col gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
          <span className="font-bold text-lg tracking-tight text-foreground">
            Placement OS
          </span>
          <span className="text-[10px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded font-mono font-medium">
            v4.0
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 overflow-y-auto max-h-[50vh] pr-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-accent text-accent-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* User profile card & Solved Progress */}
      <div className="flex flex-col gap-4 border-t border-border pt-4 px-2">
        {/* Solved Progress */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs font-semibold text-muted-foreground">
            <span>Overall Completion</span>
            <span>{solvedCount}/{totalCount} ({percentComplete}%)</span>
          </div>
          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out" 
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>

        {/* User Card */}
        {user && (
          <div className="flex items-center justify-between bg-secondary/40 border border-border/50 rounded-lg p-2 transition-all">
            <Link 
              href="/profile"
              className="flex items-center gap-2 group cursor-pointer"
            >
              <img 
                src={user.profilePhoto} 
                alt={user.name} 
                className="w-8 h-8 rounded-full border border-border/80 object-cover bg-secondary group-hover:opacity-80 transition-all"
              />
              <div className="flex flex-col truncate max-w-[110px]">
                <span className="text-xs font-bold text-foreground group-hover:underline truncate">
                  {user.name}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {user.currentYear}
                </span>
              </div>
            </Link>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded-md text-muted-foreground hover:bg-secondary hover:text-red-500 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
