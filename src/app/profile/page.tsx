'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { User, Mail, Calendar, Target, Award, Building2, Flame, LogOut, Download, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, updateProfile, logout, deleteAccount } = useAuth()
  const { problems, mockOAs, mistakeLogs, interviewJournals } = useData()

  // Form State
  const [name, setName] = useState(user?.name || '')
  const [currentYear, setCurrentYear] = useState(user?.currentYear || '3rd Year')
  const [dailyGoal, setDailyGoal] = useState<number>(user?.dailyGoal || 10)
  const [isEditing, setIsEditing] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  if (!user) return null

  const solvedCount = problems.filter((p) => p.status).length
  const totalCount = 307

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    // Retain existing target companies from storage
    const storedTargets = localStorage.getItem('dsa_target_companies')
    const targetCompanies = storedTargets ? JSON.parse(storedTargets) : []
    updateProfile(name, currentYear, dailyGoal, targetCompanies)
    setIsEditing(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  // Export all local storage variables as a single JSON file
  const handleExportData = () => {
    const data: Record<string, string | null> = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        data[key] = localStorage.getItem(key)
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `placement_os_backup_${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleDeleteAccount = () => {
    if (confirm('WARNING: Are you absolutely sure you want to permanently delete your account? This will wipe all solved problems, streaks, mock tests, and mistakes logs.')) {
      deleteAccount()
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6 max-w-4xl"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link 
          href="/dashboard"
          className="p-1 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            User Profile
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage your student account settings and export backups
          </p>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6">
        
        {/* Profile picture */}
        <img
          src={user.profilePhoto}
          alt={user.name}
          className="w-20 h-20 rounded-full border border-border/80 object-cover shadow-sm bg-secondary"
        />

        <div className="flex-1 flex flex-col gap-4 w-full text-center md:text-left">
          <div>
            <h2 className="text-xl font-bold text-foreground leading-tight">
              {user.name}
            </h2>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-1 text-xs text-muted-foreground font-semibold">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                {user.email}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Member since {user.createdDate}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold mt-1">
            <div className="bg-secondary/30 p-3 rounded-lg border border-border/40 text-center">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Solved Problems</span>
              <span className="text-lg font-bold text-foreground block mt-1">{solvedCount} / {totalCount}</span>
            </div>
            <div className="bg-secondary/30 p-3 rounded-lg border border-border/40 text-center">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Mock OAs</span>
              <span className="text-lg font-bold text-foreground block mt-1">{mockOAs.length}</span>
            </div>
            <div className="bg-secondary/30 p-3 rounded-lg border border-border/40 text-center">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Logged Mistakes</span>
              <span className="text-lg font-bold text-red-500 block mt-1">{mistakeLogs.length}</span>
            </div>
            <div className="bg-secondary/30 p-3 rounded-lg border border-border/40 text-center">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Interview Rounds</span>
              <span className="text-lg font-bold text-primary block mt-1">{interviewJournals.length}</span>
            </div>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="text-xs font-semibold text-emerald-600 bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3 text-center">
          Profile settings saved successfully!
        </div>
      )}

      {/* Details Forms */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Edit Info Form */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm md:col-span-2 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <User className="w-4.5 h-4.5 text-primary" />
            Profile Details
          </h3>

          <form onSubmit={handleSave} className="flex flex-col gap-4 text-xs font-semibold">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-muted-foreground uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                disabled={!isEditing}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none disabled:opacity-70"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Year */}
              <div className="flex flex-col gap-1.5">
                <label className="text-muted-foreground uppercase tracking-wider">Academic Year</label>
                <select
                  disabled={!isEditing}
                  value={currentYear}
                  onChange={(e) => setCurrentYear(e.target.value)}
                  className="bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none disabled:opacity-70"
                >
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              {/* Goal */}
              <div className="flex flex-col gap-1.5">
                <label className="text-muted-foreground uppercase tracking-wider">Daily Target (Problems)</label>
                <input
                  type="number"
                  disabled={!isEditing}
                  required
                  min={1}
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(parseInt(e.target.value) || 0)}
                  className="bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none disabled:opacity-70"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-border/50 pt-4 mt-1">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 border border-border rounded-lg text-muted-foreground hover:bg-secondary font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-95 shadow transition-all"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-1.5 bg-secondary text-foreground hover:bg-border rounded-lg font-bold transition-all"
                >
                  Edit Profile
                </button>
              )}
            </div>

          </form>
        </div>

        {/* Data Utilities Panel */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4 justify-between">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-foreground">Account Utilities</h3>
            
            <button
              onClick={handleExportData}
              className="flex items-center gap-2.5 w-full py-2.5 bg-secondary hover:bg-border text-xs font-semibold text-foreground rounded-lg border border-border shadow-sm transition-all px-3"
            >
              <Download className="w-4 h-4 text-primary" />
              <span>Export Backups (JSON)</span>
            </button>
          </div>

          <div className="flex flex-col gap-2.5 border-t border-border/50 pt-4">
            <button
              onClick={logout}
              className="flex items-center gap-2.5 w-full py-2.5 bg-secondary hover:bg-border text-xs font-semibold text-foreground rounded-lg border border-border shadow-sm transition-all px-3"
            >
              <LogOut className="w-4 h-4 text-muted-foreground" />
              <span>Log out session</span>
            </button>

            <button
              onClick={handleDeleteAccount}
              className="flex items-center gap-2.5 w-full py-2.5 bg-red-500/10 border border-red-500/20 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-500/20 transition-all px-3"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
              <span>Delete account profile</span>
            </button>
          </div>
        </div>

      </div>

    </motion.div>
  )
}
