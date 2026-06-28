'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, Calendar, RefreshCw, CheckCircle2, ChevronRight } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { Problem } from '@/lib/seedData'
import { ProblemModal } from '@/components/ProblemModal'

export default function RevisionPage() {
  const { problems, logAttempt } = useData()
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null)

  const todayStr = new Date().toISOString().split('T')[0]

  // Grouped Revisions
  const groupedRevisions = useMemo(() => {
    const overdue: Problem[] = []
    const dueToday: Problem[] = []
    const upcoming: Problem[] = []

    problems.forEach((prob) => {
      if (!prob.status || !prob.nextRevision) return

      if (prob.nextRevision < todayStr) {
        overdue.push(prob)
      } else if (prob.nextRevision === todayStr) {
        dueToday.push(prob)
      } else {
        upcoming.push(prob)
      }
    })

    // Sort by priority (overdue sorted oldest first, upcoming closest first)
    overdue.sort((a, b) => (a.nextRevision || '').localeCompare(b.nextRevision || ''))
    dueToday.sort((a, b) => a.roi - b.roi)
    upcoming.sort((a, b) => (a.nextRevision || '').localeCompare(b.nextRevision || ''))

    return { overdue, dueToday, upcoming }
  }, [problems, todayStr])

  const getDifficultyColor = (diff: string) => {
    if (diff === 'Easy') return 'text-emerald-500 bg-emerald-500/10'
    if (diff === 'Medium') return 'text-amber-500 bg-amber-500/10'
    return 'text-red-500 bg-red-500/10'
  }

  // Quick Action Solve Logger
  const handleQuickStatus = (problemId: number, status: string, confidence: number) => {
    const prob = problems.find((p) => p.id === problemId)
    if (prob) {
      logAttempt(
        problemId,
        prob.timeTaken || 30,
        prob.hintUsed || 'No',
        confidence,
        status,
        prob.notes || 'Quick status update via Revision Panel.'
      )
    }
  }

  const renderRevisionList = (list: Problem[], emptyMessage: string) => {
    if (list.length === 0) {
      return (
        <div className="p-6 text-center text-muted-foreground bg-secondary/10 rounded-xl border border-border/50 font-medium">
          {emptyMessage}
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-3">
        {list.map((prob) => (
          <div 
            key={prob.id}
            className="flex flex-col md:flex-row md:items-center justify-between bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-all gap-4"
          >
            {/* Left detail info */}
            <div 
              className="flex-1 cursor-pointer flex flex-col gap-1"
              onClick={() => setActiveProblem(prob)}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-muted-foreground">#{prob.id}</span>
                <h3 className="font-bold text-foreground hover:underline flex items-center gap-1">
                  {prob.name}
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
                </h3>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium mt-0.5">
                <span className={`px-2 py-0.5 rounded-full ${getDifficultyColor(prob.difficulty)}`}>
                  {prob.difficulty}
                </span>
                <span>•</span>
                <span>ROI: {prob.roi}</span>
                <span>•</span>
                <span>Topic: {prob.topic}</span>
                <span>•</span>
                <span>Pattern: {prob.pattern}</span>
                <span>•</span>
                <span className="font-mono text-primary font-semibold">Due: {prob.nextRevision}</span>
              </div>
            </div>

            {/* Quick Status Buttons */}
            <div className="flex items-center gap-2 border-t md:border-t-0 border-border/50 pt-3 md:pt-0">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mr-2 hidden sm:inline">
                Mark outcome:
              </span>
              <button
                onClick={() => handleQuickStatus(prob.id, 'Green', 5)}
                className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold hover:bg-emerald-500/20 transition-all"
              >
                Green (Easy)
              </button>
              <button
                onClick={() => handleQuickStatus(prob.id, 'Yellow', 3)}
                className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg text-xs font-bold hover:bg-amber-500/20 transition-all"
              >
                Yellow (Struggled)
              </button>
              <button
                onClick={() => handleQuickStatus(prob.id, 'Red', 1)}
                className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-all"
              >
                Red (Failed)
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          Today's Revision
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Spaced Repetition balanced review schedule with quick-action status logs
        </p>
      </div>

      {/* OVERDUE SECTION */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
          <AlertCircle className="w-4.5 h-4.5 text-red-500" />
          Overdue Revisions ({groupedRevisions.overdue.length})
        </h2>
        {renderRevisionList(
          groupedRevisions.overdue,
          "Excellent! You have no overdue revisions. Your preparation is perfectly scheduled!"
        )}
      </div>

      {/* DUE TODAY SECTION */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2">
          <RefreshCw className="w-4.5 h-4.5 text-amber-500 animate-spin-slow" />
          Due Today ({groupedRevisions.dueToday.length})
        </h2>
        {renderRevisionList(
          groupedRevisions.dueToday,
          "No revisions scheduled for today. Focus on learning new topics!"
        )}
      </div>

      {/* UPCOMING SECTION */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          <Calendar className="w-4.5 h-4.5 text-muted-foreground" />
          Upcoming Queue ({groupedRevisions.upcoming.length})
        </h2>
        {renderRevisionList(
          groupedRevisions.upcoming,
          "No solved problems yet. Start solving problems to construct your revision calendar!"
        )}
      </div>

      {/* Modal drawer */}
      <ProblemModal 
        problem={activeProblem} 
        onClose={() => setActiveProblem(null)} 
      />
    </motion.div>
  )
}
