'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { PenTool, CheckCircle, Circle, AlertTriangle, RefreshCw } from 'lucide-react'
import { useData } from '@/context/DataContext'

export default function MistakeJournalPage() {
  const { mistakeLogs, toggleMistakeReviewed } = useData()
  const [filterType, setFilterType] = useState('All')

  // Unique mistake types
  const mistakeTypes = useMemo(() => {
    const list = Array.from(new Set(mistakeLogs.map((m) => m.mistakeType)))
    return ['All', ...list.sort()]
  }, [mistakeLogs])

  const filteredLogs = useMemo(() => {
    return mistakeLogs.filter((log) => {
      return filterType === 'All' || log.mistakeType === filterType
    })
  }, [mistakeLogs, filterType])

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          Mistake Journal
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Chronological index of analytical flaws, edge-case oversights, and logic repairs
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex flex-col gap-1 text-xs">
          <span className="font-bold text-muted-foreground uppercase tracking-wider">Filter Mistake Category</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-secondary/50 border border-border rounded-lg px-3 py-2 text-foreground font-semibold focus:outline-none w-56"
          >
            {mistakeTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-xs font-semibold">
          <div className="text-center sm:text-right">
            <span className="text-muted-foreground uppercase text-[10px] tracking-wider block">Total Logged</span>
            <span className="text-lg font-bold text-foreground">{mistakeLogs.length}</span>
          </div>
          <div className="text-center sm:text-right">
            <span className="text-muted-foreground uppercase text-[10px] tracking-wider block">Reviewed</span>
            <span className="text-lg font-bold text-emerald-500">
              {mistakeLogs.filter((m) => m.reviewed === 'Yes').length}
            </span>
          </div>
        </div>
      </div>

      {/* TIMELINE LIST */}
      <div className="flex flex-col gap-4">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log) => {
            const isReviewed = log.reviewed === 'Yes'
            return (
              <div 
                key={log.id}
                className={`bg-card border rounded-xl p-5 shadow-sm flex items-start gap-4 transition-all ${
                  isReviewed ? 'border-border/40 opacity-70' : 'border-border hover:shadow-md'
                }`}
              >
                {/* Status Toggle Button */}
                <button
                  type="button"
                  onClick={() => toggleMistakeReviewed(log.id)}
                  className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground mt-0.5"
                >
                  {isReviewed ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 flex flex-col gap-2.5">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-bold text-base text-foreground">
                        {log.problemName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-red-500/80 bg-red-500/5 px-2 py-0.5 rounded border border-red-500/10 uppercase tracking-wide">
                          {log.mistakeType}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          Logged: {log.createdAt.split('T')[0]}
                        </span>
                        {log.reviewDate && (
                          <span className="text-[10px] font-mono text-emerald-500 font-semibold">
                            Reviewed: {log.reviewDate}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1.5 text-xs">
                    {/* Root Cause */}
                    <div className="flex flex-col gap-0.5 bg-secondary/30 p-3 rounded-lg border border-border/40">
                      <span className="font-bold text-muted-foreground uppercase text-[9px] tracking-wider flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-500/80" />
                        Analytical Root Cause
                      </span>
                      <p className="text-foreground leading-relaxed mt-1 font-medium">{log.rootCause}</p>
                    </div>

                    {/* Correction */}
                    <div className="flex flex-col gap-0.5 bg-secondary/30 p-3 rounded-lg border border-border/40">
                      <span className="font-bold text-muted-foreground uppercase text-[9px] tracking-wider flex items-center gap-1">
                        <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />
                        Correction Resolution
                      </span>
                      <p className="text-foreground leading-relaxed mt-1 font-medium">{log.solution}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="p-8 text-center text-muted-foreground bg-secondary/10 rounded-xl border border-border/50 font-semibold">
            No mistakes logged in this category. Keep coding cleanly!
          </div>
        )}
      </div>

    </motion.div>
  )
}
