'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Award, AlertTriangle, FileText, CheckCircle2, ChevronRight } from 'lucide-react'
import { useData } from '@/context/DataContext'

export default function InterviewJournalPage() {
  const { interviewJournals, addInterviewJournal } = useData()

  // Form State
  const [company, setCompany] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [round, setRound] = useState('Technical Round 1')
  const [questions, setQuestions] = useState('')
  const [difficulty, setDifficulty] = useState('Medium')
  const [mistakes, setMistakes] = useState('')
  const [feedback, setFeedback] = useState('')
  const [learnings, setLearnings] = useState('')
  const [revisionRequired, setRevisionRequired] = useState('No')

  const [showForm, setShowForm] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!company || !questions) return
    addInterviewJournal(
      company,
      date,
      round,
      questions,
      difficulty,
      mistakes,
      feedback,
      learnings,
      revisionRequired
    )

    // Reset Form
    setCompany('')
    setQuestions('')
    setMistakes('')
    setFeedback('')
    setLearnings('')
    setRevisionRequired('No')
    setShowForm(false)
  }

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Interview Journal
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Personal repository of campus placement interviews, feedback loops, and interview questions
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-sm shadow hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Log Round</span>
        </button>
      </div>

      {/* NEW ROUND LOG FORM */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <h2 className="text-sm font-bold text-foreground">Log Interview Round</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-muted-foreground uppercase">Company</label>
              <input
                type="text"
                required
                placeholder="e.g. Oracle"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-muted-foreground uppercase">Interview Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-muted-foreground uppercase">Round Type</label>
              <select
                value={round}
                onChange={(e) => setRound(e.target.value)}
                className="bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
              >
                <option value="Technical Round 1">Technical Round 1</option>
                <option value="Technical Round 2">Technical Round 2</option>
                <option value="System Design Round">System Design Round</option>
                <option value="Managerial Round">Managerial Round</option>
                <option value="HR Round">HR Round</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-muted-foreground uppercase">Round Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <label className="font-bold text-muted-foreground uppercase">DSA / Coding Questions Asked</label>
            <textarea
              required
              rows={2}
              placeholder="e.g. Q1. Merge Intervals with dynamic programming check. Q2. Boundary Traversal of Binary Tree."
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              className="bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-muted-foreground uppercase">Mistakes Made / Code Failures</label>
              <input
                type="text"
                placeholder="e.g. Failed boundary checks in Q2 traversal"
                value={mistakes}
                onChange={(e) => setMistakes(e.target.value)}
                className="bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-muted-foreground uppercase">Interviewer Feedback</label>
              <input
                type="text"
                placeholder="e.g. Solid logic presentation, but needs faster coding speed"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs items-end">
            <div className="flex flex-col gap-1 md:col-span-3">
              <label className="font-bold text-muted-foreground uppercase">Key Learnings & Action Points</label>
              <input
                type="text"
                placeholder="e.g. Practice tree traversals on time limit sheets"
                value={learnings}
                onChange={(e) => setLearnings(e.target.value)}
                className="bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-muted-foreground uppercase">Revision Required?</label>
              <select
                value={revisionRequired}
                onChange={(e) => setRevisionRequired(e.target.value)}
                className="bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
              >
                <option value="No">No Revision Needed</option>
                <option value="Yes">Yes, Needs Revision</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 text-xs">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-border rounded-lg text-muted-foreground hover:bg-secondary transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all"
            >
              Log Interview
            </button>
          </div>
        </form>
      )}

      {/* TIMELINE CARDS */}
      <div className="flex flex-col gap-4">
        {interviewJournals.length > 0 ? (
          interviewJournals.map((journal) => {
            const isRevisionReq = journal.revisionRequired === 'Yes'
            return (
              <div 
                key={journal.id}
                className={`bg-card border rounded-xl p-5 shadow-sm flex flex-col gap-3 transition-all ${
                  isRevisionReq ? 'border-amber-500/30' : 'border-border'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
                      {journal.company}
                      <span className="text-xs font-semibold text-muted-foreground">— {journal.round}</span>
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-1">
                      <span className="font-mono">{journal.date}</span>
                      <span>•</span>
                      <span className={`px-2 py-0.5 rounded-full font-semibold ${getDifficultyColor(journal.difficulty)}`}>
                        {journal.difficulty}
                      </span>
                      {isRevisionReq && (
                        <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-wide">
                          Needs Revision
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-foreground bg-secondary/20 p-3 rounded-lg border border-border/50">
                  <span className="font-bold text-muted-foreground uppercase text-[9px] block mb-1">Questions Asked</span>
                  <p className="font-semibold">{journal.questions}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mt-1">
                  {/* Feedback */}
                  {journal.feedback && (
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-muted-foreground uppercase text-[9px] tracking-wider">Feedback Received</span>
                      <p className="text-muted-foreground">{journal.feedback}</p>
                    </div>
                  )}
                  {/* Mistakes */}
                  {journal.mistakes && (
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-red-500/80 uppercase text-[9px] tracking-wider">Mistakes Identified</span>
                      <p className="text-muted-foreground">{journal.mistakes}</p>
                    </div>
                  )}
                  {/* Learnings */}
                  {journal.learnings && (
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-emerald-500 uppercase text-[9px] tracking-wider">Key Takeaways</span>
                      <p className="text-muted-foreground">{journal.learnings}</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="p-8 text-center text-muted-foreground bg-secondary/10 rounded-xl border border-border/50 font-semibold">
            No interview rounds logged in this journal yet. Best of luck in your first round!
          </div>
        )}
      </div>

    </motion.div>
  )
}
