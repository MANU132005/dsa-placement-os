'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FileText, Plus, LineChart as ChartIcon, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react'
import { useData, MockOA } from '@/context/DataContext'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

export default function MockOAPage() {
  const { mockOAs, addMockOA, problems } = useData()

  // Form State
  const [company, setCompany] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [questions, setQuestions] = useState(3)
  const [score, setScore] = useState(80)
  const [time, setTime] = useState(90)
  const [accuracy, setAccuracy] = useState(100)
  const [weakPattern, setWeakPattern] = useState('All')
  const [mistakes, setMistakes] = useState('')
  const [action, setAction] = useState('')

  const [showForm, setShowForm] = useState(false)

  // Pattern Encyclopedia options
  const patternsList = useMemo(() => {
    return ['None', ...Array.from(new Set(problems.map((p) => p.pattern))).sort()]
  }, [problems])

  // KPIs
  const kpis = useMemo(() => {
    const total = mockOAs.length
    if (total === 0) {
      return {
        total: 0,
        avgScore: 0,
        avgTime: 0,
        avgAccuracy: 0,
        bestScore: 0,
        weakPattern: 'None'
      }
    }

    const avgScore = Math.round(mockOAs.reduce((sum, item) => sum + item.score, 0) / total)
    const avgTime = Math.round(mockOAs.reduce((sum, item) => sum + item.time, 0) / total)
    const avgAccuracy = Math.round(mockOAs.reduce((sum, item) => sum + item.accuracy, 0) / total)
    const bestScore = Math.max(...mockOAs.map((item) => item.score))

    // Count weak pattern frequencies
    const patternFreqs: Record<string, number> = {}
    mockOAs.forEach((item) => {
      if (item.weakPattern && item.weakPattern !== 'None') {
        patternFreqs[item.weakPattern] = (patternFreqs[item.weakPattern] || 0) + 1
      }
    })
    const sortedPats = Object.entries(patternFreqs).sort((a, b) => b[1] - a[1])
    const weakPat = sortedPats.length > 0 ? sortedPats[0][0] : 'None'

    return { total, avgScore, avgTime, avgAccuracy, bestScore, weakPattern: weakPat }
  }, [mockOAs])

  // Recharts Chart Data (Chronological order)
  const chartData = useMemo(() => {
    return [...mockOAs].reverse().map((item) => ({
      date: item.date,
      score: item.score,
      accuracy: item.accuracy,
      runningAvg: item.runningAverage
    }))
  }, [mockOAs])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!company) return
    addMockOA(company, date, questions, score, time, accuracy, weakPattern, mistakes, action)
    
    // Reset Form
    setCompany('')
    setScore(80)
    setTime(90)
    setAccuracy(100)
    setMistakes('')
    setAction('')
    setShowForm(false)
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
            Mock OA Tracker
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Simulated Online Assessment performance metrics and mistake resolution logs
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-sm shadow hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Log Assessment</span>
        </button>
      </div>

      {/* NEW ASSESSMENT MODAL / FORM */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <h2 className="text-sm font-bold text-foreground">Log New Mock OA</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-muted-foreground uppercase">Company Target</label>
              <input
                type="text"
                required
                placeholder="e.g. Amazon"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-muted-foreground uppercase">Attempt Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-muted-foreground uppercase">Total Questions</label>
              <input
                type="number"
                min={1}
                value={questions}
                onChange={(e) => setQuestions(parseInt(e.target.value) || 0)}
                className="bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-muted-foreground uppercase">Score Achieved (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={score}
                onChange={(e) => setScore(parseInt(e.target.value) || 0)}
                className="bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-muted-foreground uppercase">Time Spent (Mins)</label>
              <input
                type="number"
                min={1}
                value={time}
                onChange={(e) => setTime(parseInt(e.target.value) || 0)}
                className="bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-muted-foreground uppercase">Accuracy (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={accuracy}
                onChange={(e) => setAccuracy(parseInt(e.target.value) || 0)}
                className="bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-muted-foreground uppercase">Weakest Pattern Detected</label>
              <select
                value={weakPattern}
                onChange={(e) => setWeakPattern(e.target.value)}
                className="bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
              >
                {patternsList.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-muted-foreground uppercase">Observations / Mistakes Made</label>
              <input
                type="text"
                placeholder="e.g. Time complexity exceeded in Q2 due to unoptimized recursive call."
                value={mistakes}
                onChange={(e) => setMistakes(e.target.value)}
                className="bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-muted-foreground uppercase">Correction Action Plan</label>
              <input
                type="text"
                placeholder="e.g. Revise dynamic programming Memoization techniques."
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
              />
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
              Submit Assessment
            </button>
          </div>
        </form>
      )}

      {/* KPI GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* KPI 1 */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm text-center">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Total Assessments</span>
          <h3 className="text-2xl font-extrabold text-foreground mt-1.5">{kpis.total}</h3>
        </div>
        {/* KPI 2 */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm text-center">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Average Score</span>
          <h3 className="text-2xl font-extrabold text-primary mt-1.5">{kpis.avgScore}%</h3>
        </div>
        {/* KPI 3 */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm text-center">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Avg Solve Time</span>
          <h3 className="text-2xl font-extrabold text-foreground mt-1.5">{kpis.avgTime}m</h3>
        </div>
        {/* KPI 4 */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm text-center">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Avg Accuracy</span>
          <h3 className="text-2xl font-extrabold text-foreground mt-1.5">{kpis.avgAccuracy}%</h3>
        </div>
        {/* KPI 5 */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm text-center">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Highest Score</span>
          <h3 className="text-2xl font-extrabold text-emerald-500 mt-1.5">{kpis.bestScore}%</h3>
        </div>
        {/* KPI 6 */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm text-center truncate">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Weakest Pattern</span>
          <h3 className="text-sm font-extrabold text-red-500 mt-2.5 truncate">{kpis.weakPattern}</h3>
        </div>
      </div>

      {/* TREND CHART */}
      {mockOAs.length > 0 ? (
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <ChartIcon className="w-4 h-4 text-primary" />
            Performance & Score Progression Trends
          </h2>
          <div className="w-full h-64 mt-1 font-sans text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  name="Test Score (%)"
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="runningAvg" 
                  name="Running Average"
                  stroke="#10b981" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm text-center text-muted-foreground font-semibold">
          Log mock assessments to populate the scoring trend lines.
        </div>
      )}

      {/* HISTORY TABLE */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-secondary/10">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            History Log ({mockOAs.length} entries)
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/30 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Target Company</th>
                <th className="py-3 px-4 w-20 text-center">Score</th>
                <th className="py-3 px-4 w-20 text-center">Time</th>
                <th className="py-3 px-4 w-20 text-center">Accuracy</th>
                <th className="py-3 px-4">Weak Area</th>
                <th className="py-3 px-4">Observations / Action Plan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {mockOAs.length > 0 ? (
                mockOAs.map((item) => (
                  <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-4 font-mono text-muted-foreground">{item.date}</td>
                    <td className="py-3 px-4 font-bold text-foreground">{item.company}</td>
                    <td className="py-3 px-4 text-center font-bold text-primary">{item.score}%</td>
                    <td className="py-3 px-4 text-center text-muted-foreground">{item.time}m</td>
                    <td className="py-3 px-4 text-center text-muted-foreground">{item.accuracy}%</td>
                    <td className="py-3 px-4 text-red-500 font-semibold">{item.weakPattern || '-'}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      <div className="font-semibold text-foreground">{item.mistakes}</div>
                      <div className="text-[10px] text-primary">{item.action}</div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground font-semibold">
                    No mock assessments logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </motion.div>
  )
}
