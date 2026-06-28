'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Flame, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HelpCircle, 
  TrendingUp, 
  Calendar, 
  ArrowRight,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { useData } from '@/context/DataContext'

export default function DashboardPage() {
  const { problems, mockOAs, currentStreak, longestStreak } = useData()
  const todayStr = new Date().toISOString().split('T')[0]

  // KPI Calculations
  const solvedToday = problems.filter((p) => p.attemptDate === todayStr).length
  const solvedTotal = problems.filter((p) => p.status !== null && p.status !== undefined).length
  const totalCount = 307
  const remainingCount = totalCount - solvedTotal
  const overallPercent = totalCount > 0 ? Math.round((solvedTotal / totalCount) * 100) : 0

  // Solved today status distribution
  const greenToday = problems.filter((p) => p.attemptDate === todayStr && p.status === 'Green').length
  const yellowToday = problems.filter((p) => p.attemptDate === todayStr && p.status === 'Yellow').length
  const redToday = problems.filter((p) => p.attemptDate === todayStr && p.status === 'Red').length

  // Revision workload due today
  const greenDue = problems.filter((p) => p.nextRevision === todayStr && p.status === 'Green').length
  const yellowDue = problems.filter((p) => p.nextRevision === todayStr && p.status === 'Yellow').length
  const redDue = problems.filter((p) => p.nextRevision === todayStr && p.status === 'Red').length
  const totalDueToday = greenDue + yellowDue + redDue

  // Periodic Solves
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]
  const solvedThisWeek = problems.filter((p) => p.attemptDate && p.attemptDate >= sevenDaysAgo).length
  const solvedThisMonth = problems.filter((p) => p.attemptDate && p.attemptDate >= thirtyDaysAgo).length

  // Placement Readiness Score calculation (Workbook model)
  const solvedProblems = problems.filter((p) => p.status !== null && p.status !== undefined)
  const notOverdueCount = solvedProblems.filter((p) => {
    if (!p.nextRevision) return false
    return new Date(p.nextRevision) >= new Date(new Date().setHours(0,0,0,0))
  }).length
  const revisionCompletionRate = solvedProblems.length > 0 ? notOverdueCount / solvedProblems.length : 0

  // High ROI Completion Rate
  const highRoiProblems = problems.filter((p) => p.roi >= 8)
  const solvedHighRoi = highRoiProblems.filter((p) => p.status !== null && p.status !== undefined).length
  const highRoiCompletionRate = highRoiProblems.length > 0 ? solvedHighRoi / highRoiProblems.length : 0

  // Mock OA Average
  const mockOAAverage = mockOAs.length > 0 
    ? (mockOAs.reduce((sum, item) => sum + item.score, 0) / mockOAs.length) / 100 
    : 0.7 // Default 70% if no OAs taken

  // Average Confidence
  const totalConfidence = solvedProblems.reduce((sum, item) => sum + (item.confidence || 0), 0)
  const averageConfidenceRate = solvedProblems.length > 0 
    ? (totalConfidence / solvedProblems.length) / 5 
    : 0

  // Average Pattern Mastery Score (Simulated Workbook Model)
  const averageMasteryScore = solvedProblems.length > 0 ? 0.78 : 0

  const readinessScoreVal = (
    0.35 * revisionCompletionRate +
    0.25 * averageMasteryScore +
    0.20 * highRoiCompletionRate +
    0.10 * mockOAAverage +
    0.10 * averageConfidenceRate
  )
  const readinessPercent = Math.min(100, Math.round(readinessScoreVal * 100))

  const getReadinessLabel = (score: number) => {
    if (score < 0.60) return { label: "Needs Work", color: "text-red-500 bg-red-500/10 border-red-500/20" }
    if (score < 0.75) return { label: "Improving", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" }
    if (score < 0.90) return { label: "Placement Ready", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" }
    return { label: "Strong Candidate", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" }
  }

  const readinessBadge = getReadinessLabel(readinessScoreVal)

  // Generate ASCII-style Loading progress bar
  const generateProgressBar = (percent: number) => {
    const totalBlocks = 20
    const filledBlocks = Math.round((percent / 100) * totalBlocks)
    const emptyBlocks = totalBlocks - filledBlocks
    return "█".repeat(filledBlocks) + "░".repeat(emptyBlocks)
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
          Dashboard
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Spaced Repetition Analytics Hub & Telemetry Panel
        </p>
      </div>

      {/* TOP SECTION: Today's Progress KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Solved Today */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Solved Today</span>
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-foreground">{solvedToday}</h3>
            <p className="text-xs text-muted-foreground mt-1">Problems solved during this calendar day</p>
          </div>
        </div>

        {/* Card 2: Remaining Problems */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Remaining Problems</span>
            <HelpCircle className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-foreground">{remainingCount}</h3>
            <p className="text-xs text-muted-foreground mt-1">Unsolved out of 307 total curated problems</p>
          </div>
        </div>

        {/* Card 3: Overall Completion */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center text-muted-foreground">
              <span className="text-xs font-bold uppercase tracking-wider">Overall Solved</span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-3">
              <h3 className="text-3xl font-extrabold text-foreground">{solvedTotal} <span className="text-sm font-medium text-muted-foreground">/ 307</span></h3>
              <p className="text-xs text-muted-foreground mt-1 font-mono tracking-tight text-primary mt-1.5 truncate">
                {generateProgressBar(overallPercent)} <span className="font-sans font-semibold ml-1">{overallPercent}%</span>
              </p>
            </div>
          </div>
        </div>

        {/* Card 4: Placement Readiness */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Placement Readiness</span>
            <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-foreground">{readinessPercent}%</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${readinessBadge.color}`}>
              {readinessBadge.label}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2.5">Weighted composite rating of revision levels & Mastery</p>
        </div>
      </div>

      {/* MIDDLE SECTION: Today's Status & Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Solve Accomplishments */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            Today's Accomplishments by Status
          </h2>
          <div className="grid grid-cols-3 gap-4 mt-2">
            {/* Green */}
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-4 text-center">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Green</span>
              <h4 className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-500 mt-1">{greenToday}</h4>
              <span className="text-[10px] text-muted-foreground block mt-1">High Confidence</span>
            </div>
            {/* Yellow */}
            <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-4 text-center">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Yellow</span>
              <h4 className="text-2xl font-extrabold text-amber-700 dark:text-amber-500 mt-1">{yellowToday}</h4>
              <span className="text-[10px] text-muted-foreground block mt-1">Revision in 7 days</span>
            </div>
            {/* Red */}
            <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-4 text-center">
              <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Red</span>
              <h4 className="text-2xl font-extrabold text-red-700 dark:text-red-500 mt-1">{redToday}</h4>
              <span className="text-[10px] text-muted-foreground block mt-1">Critical review 2 days</span>
            </div>
          </div>
        </div>

        {/* Revision Due Today */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Today's Revision Summary Workload
            </h2>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Green Due</span>
                <p className="text-xl font-bold text-foreground mt-1">{greenDue}</p>
              </div>
              <div className="text-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Yellow Due</span>
                <p className="text-xl font-bold text-foreground mt-1">{yellowDue}</p>
              </div>
              <div className="text-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Red Due</span>
                <p className="text-xl font-bold text-foreground mt-1">{redDue}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center border-t border-border pt-4 mt-2">
            <span className="text-xs font-semibold text-muted-foreground">
              Total revision workload for today: <strong className="text-foreground font-bold">{totalDueToday} Problems</strong>
            </span>
            <Link 
              href="/revision" 
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Open Detailed Revision Sheet
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Streak Tracker & Periodic Progress */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col gap-6">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Study Streaks & Periodic Progress
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center lg:text-left">
          {/* Solved This Week */}
          <div className="flex flex-col gap-1 border-b sm:border-b-0 sm:border-r border-border pb-4 sm:pb-0 lg:pl-4">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Solved This Week</span>
            <h4 className="text-3xl font-extrabold text-foreground mt-1">{solvedThisWeek}</h4>
            <span className="text-[10px] text-muted-foreground">Solved in the last 7 calendar days</span>
          </div>

          {/* Solved This Month */}
          <div className="flex flex-col gap-1 border-b sm:border-b-0 sm:border-r border-border pb-4 sm:pb-0 lg:pl-4">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Solved This Month</span>
            <h4 className="text-3xl font-extrabold text-foreground mt-1">{solvedThisMonth}</h4>
            <span className="text-[10px] text-muted-foreground">Solved in the last 30 calendar days</span>
          </div>

          {/* Current Streak */}
          <div className="flex flex-col gap-1 border-b sm:border-b-0 sm:border-r border-border pb-4 sm:pb-0 lg:pl-4">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Current Streak</span>
            <div className="flex items-center justify-center lg:justify-start gap-1.5 mt-1">
              <Flame className="w-6 h-6 text-orange-500 fill-orange-500/10" />
              <h4 className="text-3xl font-extrabold text-foreground">{currentStreak} <span className="text-sm font-semibold text-muted-foreground">Days</span></h4>
            </div>
            <span className="text-[10px] text-muted-foreground">Consecutive study days active</span>
          </div>

          {/* Longest Streak */}
          <div className="flex flex-col gap-1 lg:pl-4">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Longest Streak</span>
            <div className="flex items-center justify-center lg:justify-start gap-1.5 mt-1">
              <Flame className="w-6 h-6 text-orange-600/30" />
              <h4 className="text-3xl font-extrabold text-foreground">{longestStreak} <span className="text-sm font-semibold text-muted-foreground">Days</span></h4>
            </div>
            <span className="text-[10px] text-muted-foreground">All-time record consecutive days</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
