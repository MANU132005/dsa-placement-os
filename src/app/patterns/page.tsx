'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, X, Award, AlertTriangle, ArrowRight, ShieldCheck, Flame } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { Pattern } from '@/lib/seedData'

export default function PatternsPage() {
  const { patterns, problems } = useData()
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null)

  // Compute solved progress for each pattern
  const patternProgress = useMemo(() => {
    const progress: Record<string, { solved: number; total: number; percent: number }> = {}
    
    // Initialize record
    patterns.forEach((pat) => {
      progress[pat.name] = { solved: 0, total: 0, percent: 0 }
    })

    // Count problems
    problems.forEach((prob) => {
      const stdPat = prob.pattern
      if (progress[stdPat]) {
        progress[stdPat].total += 1
        if (prob.status) {
          progress[stdPat].solved += 1
        }
      }
    })

    // Calculate percentage
    Object.keys(progress).forEach((key) => {
      const item = progress[key]
      item.percent = item.total > 0 ? Math.round((item.solved / item.total) * 100) : 0
    })

    return progress
  }, [patterns, problems])

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
          Pattern Encyclopedia
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Master reference database for {patterns.length} core algorithmic problem patterns
        </p>
      </div>

      {/* PATTERNS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {patterns.map((pat) => {
          const prog = patternProgress[pat.name] || { solved: 0, total: 0, percent: 0 }
          
          return (
            <div
              key={pat.name}
              onClick={() => setSelectedPattern(pat)}
              className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between gap-4 transition-all"
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-base text-foreground truncate max-w-[180px]">
                    {pat.name}
                  </h3>
                  <span className="text-[10px] font-bold text-primary bg-accent px-2 py-0.5 rounded">
                    ROI: {pat.roi}/10
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {pat.clues}
                </p>
              </div>

              {/* Progress */}
              <div className="flex flex-col gap-1 border-t border-border/50 pt-3">
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                  <span>Solved Progress</span>
                  <span>{prog.solved}/{prog.total} ({prog.percent}%)</span>
                </div>
                <div className="w-full h-1 bg-secondary rounded-full overflow-hidden mt-1">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${prog.percent}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* PATTERN DETAILS MODAL */}
      {selectedPattern && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0" 
            onClick={() => setSelectedPattern(null)} 
          />
          <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto z-10 flex flex-col justify-between animate-scale-in">
            {/* Header */}
            <div className="p-6 border-b border-border flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Pattern Details Reference
                </span>
                <h2 className="text-xl font-bold text-foreground mt-0.5">
                  {selectedPattern.name}
                </h2>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] font-semibold text-muted-foreground">
                  <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded">
                    ROI Rating: {selectedPattern.roi}/10
                  </span>
                  <span>•</span>
                  <span>Difficulty: {selectedPattern.difficulty}</span>
                  <span>•</span>
                  <span>Frequency: {"★".repeat(selectedPattern.frequency)}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPattern(null)}
                className="p-1 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col gap-5 overflow-y-auto text-sm leading-relaxed text-foreground">
              {/* Clues */}
              <div className="flex flex-col gap-1">
                <h4 className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Recognition Clues</h4>
                <p>{selectedPattern.clues}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* When to use */}
                <div className="flex flex-col gap-1 bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3">
                  <h4 className="font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[10px] tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    When to use
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">{selectedPattern.whenToUse}</p>
                </div>

                {/* When NOT to use */}
                <div className="flex flex-col gap-1 bg-red-500/5 border border-red-500/10 rounded-lg p-3">
                  <h4 className="font-bold text-red-600 dark:text-red-400 uppercase text-[10px] tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    When NOT to use
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">{selectedPattern.whenNotToUse}</p>
                </div>
              </div>

              {/* Complexities */}
              <div className="flex gap-6 border-y border-border py-3.5 font-mono text-xs">
                <div>
                  <strong className="text-muted-foreground uppercase text-[10px] font-sans block mb-0.5">Average Time Complexity</strong>
                  {selectedPattern.timeComplexity}
                </div>
                <div>
                  <strong className="text-muted-foreground uppercase text-[10px] font-sans block mb-0.5">Average Space Complexity</strong>
                  {selectedPattern.spaceComplexity}
                </div>
              </div>

              {/* Mistakes */}
              <div className="flex flex-col gap-1">
                <h4 className="font-bold text-red-500/80 uppercase text-[10px] tracking-wider flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Common Mistakes & Pitfalls
                </h4>
                <p className="text-muted-foreground">{selectedPattern.commonMistakes}</p>
              </div>

              {/* Rep Problems */}
              <div className="flex flex-col gap-1">
                <h4 className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Representative Problems</h4>
                <p className="text-muted-foreground font-medium">{selectedPattern.representativeProblems}</p>
              </div>

              {/* Top Questions */}
              <div className="flex flex-col gap-1">
                <h4 className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Top Campus Interview Questions</h4>
                <p className="text-muted-foreground font-medium">{selectedPattern.topQuestions}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-secondary/10 flex justify-end">
              <button
                onClick={() => setSelectedPattern(null)}
                className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-xs shadow hover:opacity-90 transition-all"
              >
                Close Reference
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
