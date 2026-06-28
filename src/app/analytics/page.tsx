'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { BarChart as ChartIcon, Calendar, Sparkles, TrendingUp, Heart } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts'

export default function AnalyticsPage() {
  const { problems } = useData()

  // 1. Topic Completion Data
  const topicData = useMemo(() => {
    const counts: Record<string, { solved: number; total: number }> = {}
    problems.forEach((p) => {
      if (!counts[p.topic]) {
        counts[p.topic] = { solved: 0, total: 0 }
      }
      counts[p.topic].total += 1
      if (p.status) {
        counts[p.topic].solved += 1
      }
    })

    return Object.entries(counts).map(([name, val]) => ({
      name,
      solved: val.solved,
      total: val.total,
      percent: val.total > 0 ? Math.round((val.solved / val.total) * 100) : 0
    })).sort((a, b) => b.percent - a.percent)
  }, [problems])

  // 2. Pattern Completion Data (Top 10)
  const patternData = useMemo(() => {
    const counts: Record<string, { solved: number; total: number }> = {}
    problems.forEach((p) => {
      if (!counts[p.pattern]) {
        counts[p.pattern] = { solved: 0, total: 0 }
      }
      counts[p.pattern].total += 1
      if (p.status) {
        counts[p.pattern].solved += 1
      }
    })

    return Object.entries(counts).map(([name, val]) => ({
      name,
      solved: val.solved,
      total: val.total,
      percent: val.total > 0 ? Math.round((val.solved / val.total) * 100) : 0
    })).sort((a, b) => b.percent - a.percent).slice(0, 10)
  }, [problems])

  // 3. Difficulty Solve Distribution Data
  const difficultyData = useMemo(() => {
    const solvedProbs = problems.filter((p) => p.status)
    const easy = solvedProbs.filter((p) => p.difficulty === 'Easy').length
    const medium = solvedProbs.filter((p) => p.difficulty === 'Medium').length
    const hard = solvedProbs.filter((p) => p.difficulty === 'Hard').length

    return [
      { name: 'Easy', value: easy, color: '#10b981' },
      { name: 'Medium', value: medium, color: '#f59e0b' },
      { name: 'Hard', value: hard, color: '#ef4444' }
    ]
  }, [problems])

  // 4. Confidence Distribution Data
  const confidenceData = useMemo(() => {
    const solvedProbs = problems.filter((p) => p.status)
    const confCounts = [0, 0, 0, 0, 0] // indices for confidence 1 to 5
    
    solvedProbs.forEach((p) => {
      const conf = p.confidence || 3
      confCounts[conf - 1] += 1
    })

    return confCounts.map((count, idx) => ({
      rating: `${idx + 1} Star`,
      count
    }))
  }, [problems])

  // 5. GitHub-style daily revision heat map (last 15 weeks = 105 days)
  const heatmapData = useMemo(() => {
    const result = []
    const dates: Record<string, number> = {}

    // Aggregate attempts by date
    problems.forEach((p) => {
      if (p.attemptDate) {
        dates[p.attemptDate] = (dates[p.attemptDate] || 0) + 1
      }
    })

    // Construct grid for last 105 days
    for (let i = 104; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const count = dates[dateStr] || 0
      
      let colorClass = 'bg-secondary/40' // 0 solves
      if (count > 0 && count <= 2) colorClass = 'bg-primary/20 dark:bg-primary/30' // 1-2 solves
      if (count > 2 && count <= 5) colorClass = 'bg-primary/50 dark:bg-primary/60' // 3-5 solves
      if (count > 5) colorClass = 'bg-primary dark:bg-primary' // 6+ solves

      result.push({
        date: dateStr,
        count,
        colorClass
      })
    }

    return result
  }, [problems])

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
          Analytics
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Detailed metrics dashboard profiling DSA category masteries and solve consistency
        </p>
      </div>

      {/* HEAT MAP */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          Solve Activity Heat Map (Last 15 Weeks)
        </h2>
        
        {/* Heat Map grid */}
        <div className="flex flex-col gap-1 overflow-x-auto pb-2">
          <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[700px] w-full mt-1">
            {heatmapData.map((day) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.count} solved`}
                className={`w-3.5 h-3.5 rounded-sm transition-all hover:scale-110 cursor-pointer ${day.colorClass}`}
              />
            ))}
          </div>
          <div className="flex justify-end items-center gap-2 text-[10px] text-muted-foreground mt-2.5 font-medium px-1">
            <span>Less</span>
            <div className="w-2.5 h-2.5 bg-secondary/40 rounded-sm" />
            <div className="w-2.5 h-2.5 bg-primary/20 dark:bg-primary/30 rounded-sm" />
            <div className="w-2.5 h-2.5 bg-primary/50 dark:bg-primary/60 rounded-sm" />
            <div className="w-2.5 h-2.5 bg-primary dark:bg-primary rounded-sm" />
            <span>More</span>
          </div>
        </div>
      </div>

      {/* TOPICS & PATTERNS CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Topic Completions */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <h2 className="text-sm font-bold text-foreground">DSA Topic Completions (%)</h2>
          <div className="w-full h-72 font-sans text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" stroke="#64748b" width={75} />
                <Tooltip />
                <Bar dataKey="percent" name="Completions (%)" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pattern Mastery */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <h2 className="text-sm font-bold text-foreground">Top Pattern Masteries (%)</h2>
          <div className="w-full h-72 font-sans text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={patternData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" stroke="#64748b" width={85} />
                <Tooltip />
                <Bar dataKey="percent" name="Mastery (%)" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* DIFFICULTY & CONFIDENCE CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Difficulty Pie Chart */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <h2 className="text-sm font-bold text-foreground">Solved Difficulty Distribution</h2>
          <div className="w-full h-64 flex items-center justify-center font-sans text-xs">
            {difficultyData.some((d) => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={difficultyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {difficultyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-muted-foreground font-semibold">No problems solved yet.</span>
            )}
          </div>
        </div>

        {/* Confidence Area Chart */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <h2 className="text-sm font-bold text-foreground">Confidence Rating Distribution</h2>
          <div className="w-full h-64 font-sans text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={confidenceData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="rating" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Area type="monotone" dataKey="count" name="Problem Count" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </motion.div>
  )
}
