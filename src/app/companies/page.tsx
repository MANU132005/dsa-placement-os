'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Building2, Sparkles, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { Problem } from '@/lib/seedData'
import { ProblemModal } from '@/components/ProblemModal'

export default function CompaniesPage() {
  const { problems, targetCompanies } = useData()
  const [selectedCompany, setSelectedCompany] = useState('Accenture')
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null)

  // Compute stats for all target companies
  const companyStatsList = useMemo(() => {
    return targetCompanies.map((comp) => {
      // Filter problems tagged with this company
      const compProbs = problems.filter((p) => 
        (p.companyTags || '').toLowerCase().includes(comp.toLowerCase())
      )

      const total = compProbs.length
      const solved = compProbs.filter((p) => p.status).length
      const percent = total > 0 ? Math.round((solved / total) * 100) : 0

      // Identify patterns completed vs total in this company
      const patternCounts: Record<string, { solved: number; total: number }> = {}
      compProbs.forEach((p) => {
        if (!patternCounts[p.pattern]) {
          patternCounts[p.pattern] = { solved: 0, total: 0 }
        }
        patternCounts[p.pattern].total += 1
        if (p.status) {
          patternCounts[p.pattern].solved += 1
        }
      })

      // Sort patterns by solved completion rate to find strong/weak areas
      const patternRates = Object.entries(patternCounts).map(([name, counts]) => ({
        name,
        rate: counts.solved / counts.total
      }))

      patternRates.sort((a, b) => b.rate - a.rate)
      const strong = patternRates.filter((p) => p.rate >= 0.75).map((p) => p.name)
      const weak = patternRates.filter((p) => p.rate < 0.5).map((p) => p.name)

      // Top recommended unsolved problems sorted by ROI desc
      const recommended = compProbs
        .filter((p) => !p.status)
        .sort((a, b) => b.roi - a.roi)
        .slice(0, 4)

      return {
        companyName: comp,
        total,
        solved,
        percent,
        strong: strong.slice(0, 2),
        weak: weak.slice(0, 2),
        recommended
      }
    })
  }, [problems, targetCompanies])

  // Get active company stats
  const activeStats = useMemo(() => {
    return companyStatsList.find((c) => c.companyName === selectedCompany) || {
      companyName: selectedCompany,
      total: 0,
      solved: 0,
      percent: 0,
      strong: [] as string[],
      weak: [] as string[],
      recommended: [] as Problem[]
    }
  }, [companyStatsList, selectedCompany])

  const getDifficultyColor = (diff: string) => {
    if (diff === 'Easy') return 'text-emerald-500 bg-emerald-500/10'
    if (diff === 'Medium') return 'text-amber-500 bg-amber-500/10'
    return 'text-red-500 bg-red-500/10'
  }

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
          Company Readiness
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Interactive target-company preparation analytics and recommended problem queues
        </p>
      </div>

      {/* CO-SELECTOR PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left selector */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            Select Target Company
          </h2>
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Target Profile</span>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="bg-secondary/50 border border-border rounded-lg px-3 py-2 text-foreground font-semibold focus:outline-none"
            >
              {targetCompanies.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-col gap-3 border-t border-border/50 pt-4 mt-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-medium">Company Problems:</span>
              <span className="font-bold text-foreground">{activeStats.total}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-medium">Solved Questions:</span>
              <span className="font-bold text-foreground">{activeStats.solved} / {activeStats.total}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-medium">Readiness Rating:</span>
              <span className="font-extrabold text-primary">{activeStats.percent}%</span>
            </div>
          </div>
        </div>

        {/* Center profiler metrics */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between lg:col-span-2 gap-6">
          <div>
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold text-foreground">
                {activeStats.companyName} Profile Analytics
              </h2>
              <span className="text-2xl font-extrabold text-primary">
                {activeStats.percent}% <span className="text-xs font-semibold text-muted-foreground">Readiness</span>
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mt-3">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-out" 
                style={{ width: `${activeStats.percent}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strong Areas */}
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-4 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Strong Patterns
              </span>
              <ul className="text-xs text-muted-foreground flex flex-col gap-1.5 font-medium mt-1">
                {activeStats.strong.length > 0 ? (
                  activeStats.strong.map((s) => <li key={s} className="text-foreground">✓ {s}</li>)
                ) : (
                  <li>No patterns mastered yet (needs &gt;75% completion)</li>
                )}
              </ul>
            </div>

            {/* Weak Areas */}
            <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-4 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Weak Patterns
              </span>
              <ul className="text-xs text-muted-foreground flex flex-col gap-1.5 font-medium mt-1">
                {activeStats.weak.length > 0 ? (
                  activeStats.weak.map((w) => <li className="text-foreground" key={w}>⚠ {w}</li>)
                ) : (
                  <li>No weaknesses detected (all patterns are &gt;50% completed)</li>
                )}
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* RECOMMENDED PROBLEMS QUEUE */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col gap-4">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          Recommended unsolved problems for {activeStats.companyName}
        </h2>

        <div className="flex flex-col gap-3 mt-1">
          {activeStats.recommended.length > 0 ? (
            activeStats.recommended.map((prob) => (
              <div 
                key={prob.id}
                onClick={() => setActiveProblem(prob)}
                className="flex items-center justify-between p-3.5 border border-border hover:border-primary/50 hover:bg-secondary/20 rounded-xl cursor-pointer transition-all shadow-sm"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-medium text-muted-foreground">#{prob.id}</span>
                    <span className="font-bold text-foreground hover:underline">{prob.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-semibold mt-0.5">
                    <span className={`px-2 py-0.5 rounded-full ${getDifficultyColor(prob.difficulty)}`}>
                      {prob.difficulty}
                    </span>
                    <span>ROI: {prob.roi}</span>
                    <span>Topic: {prob.topic}</span>
                    <span>Pattern: {prob.pattern}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground/60" />
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-emerald-500 bg-emerald-500/5 rounded-lg border border-emerald-500/10 font-bold">
              Congratulations! You solved all curated problems for {activeStats.companyName}!
            </div>
          )}
        </div>
      </div>

      {/* Problem Modal drawer */}
      <ProblemModal 
        problem={activeProblem} 
        onClose={() => setActiveProblem(null)} 
      />
    </motion.div>
  )
}
