'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, Moon, Sun, RotateCcw, Building2, Plus, X } from 'lucide-react'
import { useData } from '@/context/DataContext'

export default function SettingsPage() {
  const { targetCompanies, setTargetCompanies, resetAllData } = useData()
  
  // Theme state
  const [theme, setTheme] = useState('light')
  const [newCompany, setNewCompany] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const activeTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
      setTheme(activeTheme)
    }
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    localStorage.setItem('dsa_theme', nextTheme)
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Watchlist Company Add/Remove
  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCompany) return
    if (targetCompanies.includes(newCompany)) return
    setTargetCompanies([...targetCompanies, newCompany])
    setNewCompany('')
  }

  const handleRemoveCompany = (name: string) => {
    setTargetCompanies(targetCompanies.filter((c) => c !== name))
  }

  const handleResetData = () => {
    if (confirm('Are you absolutely sure you want to reset all tracked solves, streaks, mistakes, mock tests, and CS reviews? This action is irreversible.')) {
      resetAllData()
      alert('Application telemetry data reset successfully.')
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6 max-w-3xl"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          Settings
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Profile configurations, layout themes, watchlist targets, and database utilities
        </p>
      </div>

      {/* THEME PANEL */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
          {theme === 'light' ? <Sun className="w-4.5 h-4.5 text-amber-500" /> : <Moon className="w-4.5 h-4.5 text-blue-500" />}
          Display Layout Theme
        </h2>
        <div className="flex justify-between items-center text-xs border-t border-border/50 pt-3 mt-1">
          <div>
            <span className="font-semibold text-foreground block">App Theme Toggle</span>
            <span className="text-muted-foreground">Switch between Dark and Light mode layouts</span>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-2 bg-secondary text-foreground hover:bg-border rounded-lg font-bold shadow-sm transition-all"
          >
            {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          </button>
        </div>
      </div>

      {/* COMPANY WATCHLIST PANEL */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Building2 className="w-4.5 h-4.5 text-primary" />
          Target Company Watchlist
        </h2>
        <p className="text-xs text-muted-foreground">
          Watchlist companies are dynamically compiled in the Company Readiness panel. Add or remove targets below.
        </p>

        {/* Company watchlist chips */}
        <div className="flex flex-wrap gap-2 border-t border-border/50 pt-4">
          {targetCompanies.map((c) => (
            <span 
              key={c}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-secondary text-foreground border border-border rounded-lg text-xs font-semibold"
            >
              {c}
              <button 
                onClick={() => handleRemoveCompany(c)}
                className="text-muted-foreground hover:text-red-500 p-0.5 rounded transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>

        {/* Add Company Form */}
        <form onSubmit={handleAddCompany} className="flex gap-2 items-center text-xs mt-2">
          <input
            type="text"
            placeholder="Add target company (e.g. Netflix)"
            value={newCompany}
            onChange={(e) => setNewCompany(e.target.value)}
            className="bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none w-56"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground font-semibold rounded-lg shadow hover:opacity-90 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Company</span>
          </button>
        </form>
      </div>

      {/* DANGER ZONE PANEL */}
      <div className="bg-card border border-red-500/20 rounded-xl p-5 shadow-sm flex flex-col gap-4 bg-red-500/5">
        <h2 className="text-sm font-bold text-red-500 flex items-center gap-2">
          <RotateCcw className="w-4.5 h-4.5 text-red-500" />
          Danger Zone
        </h2>
        <p className="text-xs text-muted-foreground">
          Resetting telemetry database restores all solved counts, streaks, CS logs, mistakes, and journals back to initial empty configurations.
        </p>
        <div className="flex justify-between items-center text-xs border-t border-red-500/10 pt-3 mt-1">
          <div>
            <span className="font-semibold text-foreground block">Reset Tracked Data</span>
            <span className="text-muted-foreground">Revert all local storage variables to default state</span>
          </div>
          <button
            onClick={handleResetData}
            className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg font-bold shadow-sm transition-all"
          >
            Reset Telemetry Data
          </button>
        </div>
      </div>

    </motion.div>
  )
}
