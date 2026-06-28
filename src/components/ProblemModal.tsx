'use client'

import React, { useState, useEffect } from 'react'
import { X, ExternalLink, ShieldCheck, Clock, Award, AlertTriangle, BookOpen } from 'lucide-react'
import { Problem } from '@/lib/seedData'
import { useData } from '@/context/DataContext'

interface ProblemModalProps {
  problem: Problem | null
  onClose: () => void
}

export const ProblemModal: React.FC<ProblemModalProps> = ({ problem, onClose }) => {
  const { logAttempt, addMistakeLog } = useData()

  // Form State
  const [timeTaken, setTimeTaken] = useState<number>(30)
  const [hintUsed, setHintUsed] = useState<string>('No')
  const [confidence, setConfidence] = useState<number>(4)
  const [status, setStatus] = useState<string>('Green')
  const [notes, setNotes] = useState<string>('')
  const [logMistake, setLogMistake] = useState<boolean>(false)
  const [mistakeType, setMistakeType] = useState<string>('Off by one')
  const [rootCause, setRootCause] = useState<string>('')
  const [solution, setSolution] = useState<string>('')

  // Sync state if problem changes
  useEffect(() => {
    if (problem) {
      setTimeTaken(problem.timeTaken || (problem.difficulty === 'Easy' ? 20 : problem.difficulty === 'Medium' ? 40 : 60))
      setHintUsed(problem.hintUsed || 'No')
      setConfidence(problem.confidence || 4)
      setStatus(problem.status || 'Green')
      setNotes(problem.notes || '')
      setLogMistake(false)
      setRootCause('')
      setSolution('')
    }
  }, [problem])

  if (!problem) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    logAttempt(problem.id, timeTaken, hintUsed, confidence, status, notes)
    
    // Log mistake if checked
    if (logMistake && rootCause) {
      addMistakeLog(problem.id, mistakeType, rootCause, solution)
    }

    onClose()
  }

  const getDifficultyColor = (diff: string) => {
    if (diff === 'Easy') return 'text-emerald-500 bg-emerald-500/10'
    if (diff === 'Medium') return 'text-amber-500 bg-amber-500/10'
    return 'text-red-500 bg-red-500/10'
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex justify-end transition-opacity duration-200">
      {/* Backdrop Click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Body */}
      <div className="relative w-full max-w-lg bg-card border-l border-border h-full flex flex-col justify-between shadow-2xl z-10 transition-transform duration-200 animate-slide-in overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-border">
          <div className="flex flex-col gap-1 pr-8">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Problem ID #{problem.id}
            </span>
            <h2 className="text-xl font-bold text-foreground leading-tight">
              {problem.name}
            </h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              <span className="text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                ROI: {problem.roi}/10
              </span>
              <span className="text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                {problem.topic}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
          {/* Metadata Section */}
          <div className="flex flex-col gap-4 bg-secondary/30 border border-border/50 rounded-xl p-4">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wide flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-primary" />
              Patterns & Recognition Clues
            </h3>
            <div className="text-xs text-foreground leading-relaxed flex flex-col gap-2.5">
              <div>
                <strong className="text-muted-foreground">Pattern Group:</strong> {problem.pattern}
              </div>
              {problem.clues && (
                <div>
                  <strong className="text-muted-foreground block mb-0.5">Recognition Clues:</strong>
                  <span className="text-muted-foreground">{problem.clues}</span>
                </div>
              )}
              {problem.mistakes && (
                <div>
                  <strong className="text-red-500/80 block mb-0.5">Common Mistake Warnings:</strong>
                  <span className="text-muted-foreground">{problem.mistakes}</span>
                </div>
              )}
              <div className="flex gap-4 border-t border-border/50 pt-2.5 mt-1 font-mono text-[10px]">
                <div>
                  <strong className="text-muted-foreground">Time Complexity:</strong> {problem.timeComplexity || 'O(N)'}
                </div>
                <div>
                  <strong className="text-muted-foreground">Space Complexity:</strong> {problem.spaceComplexity || 'O(1)'}
                </div>
              </div>
            </div>
          </div>

          {/* Resource Links */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Practice Resources</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {problem.leetcodeLink && (
                <a 
                  href={problem.leetcodeLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg border border-border bg-card hover:bg-secondary hover:text-foreground transition-all"
                >
                  <span className="font-medium text-foreground">LeetCode Practice</span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                </a>
              )}
              {problem.striverLink && (
                <a 
                  href={problem.striverLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg border border-border bg-card hover:bg-secondary hover:text-foreground transition-all"
                >
                  <span className="font-medium text-foreground">Striver's Sheet Link</span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                </a>
              )}
              {problem.gfgLink && (
                <a 
                  href={problem.gfgLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg border border-border bg-card hover:bg-secondary hover:text-foreground transition-all"
                >
                  <span className="font-medium text-foreground">GeeksforGeeks Link</span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                </a>
              )}
              {problem.youtubeLink && (
                <a 
                  href={problem.youtubeLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg border border-border bg-card hover:bg-secondary hover:text-foreground transition-all"
                >
                  <span className="font-medium text-foreground">YouTube Video Solution</span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                </a>
              )}
            </div>
          </div>

          {/* Logs / Edit Attempt Form */}
          <form id="attempt-form" onSubmit={handleSubmit} className="flex flex-col gap-4 border-t border-border pt-5">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Log solved attempt</h4>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Time taken */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Time taken (Mins)</label>
                <input 
                  type="number" 
                  required
                  min={1}
                  value={timeTaken}
                  onChange={(e) => setTimeTaken(parseInt(e.target.value) || 0)}
                  className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Hint Used */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Hint Used?</label>
                <select 
                  value={hintUsed}
                  onChange={(e) => setHintUsed(e.target.value)}
                  className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="No">No Hints Used</option>
                  <option value="Formula">Referenced Formulas</option>
                  <option value="Code">Referenced Code</option>
                  <option value="Video">Watched Walkthrough</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Confidence */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Confidence (1-5)</label>
                <select 
                  value={confidence}
                  onChange={(e) => setConfidence(parseInt(e.target.value))}
                  className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                >
                  <option value={1}>1 - Weak</option>
                  <option value={2}>2 - Shaky</option>
                  <option value={3}>3 - Decent</option>
                  <option value={4}>4 - Confident</option>
                  <option value={5}>5 - Mastered</option>
                </select>
              </div>

              {/* Status */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Solve Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="Green">Green (Perfect)</option>
                  <option value="Yellow">Yellow (Struggled)</option>
                  <option value="Red">Red (Unsolved / Hard)</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Attempt Notes / Learnings</label>
              <textarea 
                rows={2}
                placeholder="Log edge cases, optimization observations, or mistakes made..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
              />
            </div>

            {/* Log Mistake Checkbox & Subform */}
            <div className="border-t border-border/50 pt-4 mt-1 flex flex-col gap-3">
              <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={logMistake}
                  onChange={(e) => setLogMistake(e.target.checked)}
                  className="rounded border-border focus:ring-0 focus:outline-none"
                />
                <span>Log to Mistake Journal?</span>
              </label>

              {logMistake && (
                <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-3 flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-red-500/80 uppercase">Mistake Category</label>
                    <select 
                      value={mistakeType}
                      onChange={(e) => setMistakeType(e.target.value)}
                      className="bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
                    >
                      <option value="Off by one">Off by one</option>
                      <option value="Overflow">Overflow</option>
                      <option value="Wrong Binary Search">Wrong Binary Search</option>
                      <option value="Wrong Sliding Window">Wrong Sliding Window</option>
                      <option value="Wrong DFS">Wrong DFS</option>
                      <option value="Boundary Case">Boundary Case</option>
                      <option value="Recursion Error">Recursion Error</option>
                      <option value="Null Pointer">Null Pointer</option>
                      <option value="Forgot Observation">Forgot Observation</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-red-500/80 uppercase">Root Cause</label>
                    <input 
                      type="text" 
                      placeholder="Why did you make this mistake?"
                      value={rootCause}
                      onChange={(e) => setRootCause(e.target.value)}
                      className="bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-red-500/80 uppercase">Correction Action</label>
                    <input 
                      type="text" 
                      placeholder="How to prevent this next time?"
                      value={solution}
                      onChange={(e) => setSolution(e.target.value)}
                      className="bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-border flex justify-end gap-3 bg-secondary/10">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-lg text-sm font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="attempt-form"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 shadow-sm transition-all"
          >
            Save Attempt
          </button>
        </div>

      </div>
    </div>
  )
}
