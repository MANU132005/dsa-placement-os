'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, Sparkles, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { Problem } from '@/lib/seedData'
import { ProblemModal } from '@/components/ProblemModal'

export default function SearchPage() {
  const { problems } = useData()
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null)

  // Search Fields
  const [searchName, setSearchName] = useState('')
  const [searchTopic, setSearchTopic] = useState('All')
  const [searchPattern, setSearchPattern] = useState('All')
  const [searchDifficulty, setSearchDifficulty] = useState('All')
  const [searchMinRoi, setSearchMinRoi] = useState(1)
  const [searchCompany, setSearchCompany] = useState('')
  const [searchConfidence, setSearchConfidence] = useState('All')
  const [searchRevision, setSearchRevision] = useState('All') // "All", "Due", "Safe"

  // Quick preset filters
  const applyPreset = (preset: string) => {
    // Reset all
    setSearchName('')
    setSearchTopic('All')
    setSearchPattern('All')
    setSearchDifficulty('All')
    setSearchMinRoi(1)
    setSearchCompany('')
    setSearchConfidence('All')
    setSearchRevision('All')

    if (preset === 'High ROI') {
      setSearchMinRoi(8)
    } else if (preset === 'Needs Revision') {
      setSearchRevision('Due')
    } else if (preset === 'Low Confidence') {
      setSearchConfidence('Low')
    } else if (preset === 'Sliding Window') {
      setSearchPattern('Sliding Window')
    } else if (preset === 'Trees') {
      setSearchTopic('Trees')
    } else if (preset === 'FAANG') {
      setSearchCompany('FAANG')
    }
  }

  // Filter sources
  const topicsList = useMemo(() => {
    return ['All', ...Array.from(new Set(problems.map((p) => p.topic))).sort()]
  }, [problems])

  const patternsList = useMemo(() => {
    return ['All', ...Array.from(new Set(problems.map((p) => p.pattern))).sort()]
  }, [problems])

  // Results
  const results = useMemo(() => {
    return problems.filter((prob) => {
      // Name
      if (searchName && !prob.name.toLowerCase().includes(searchName.toLowerCase())) return false
      
      // Topic
      if (searchTopic !== 'All' && prob.topic !== searchTopic) return false
      
      // Pattern
      if (searchPattern !== 'All' && prob.pattern !== searchPattern) return false
      
      // Difficulty
      if (searchDifficulty !== 'All' && prob.difficulty !== searchDifficulty) return false
      
      // Min ROI
      if (prob.roi < searchMinRoi) return false
      
      // Company
      if (searchCompany) {
        const query = searchCompany.toLowerCase()
        const tags = (prob.companyTags || '').toLowerCase()
        // Support FAANG preset matching
        if (query === 'faang') {
          const faang = ['facebook', 'amazon', 'apple', 'netflix', 'google']
          if (!faang.some(comp => tags.includes(comp))) return false
        } else {
          if (!tags.includes(query)) return false
        }
      }

      // Confidence
      if (searchConfidence !== 'All') {
        const conf = prob.confidence || 0
        if (searchConfidence === 'Low' && (conf > 2 || conf === 0)) return false
        if (searchConfidence === 'High' && conf < 4) return false
      }

      // Revision Due
      if (searchRevision !== 'All') {
        const todayStr = new Date().toISOString().split('T')[0]
        const isDue = !!(prob.nextRevision && prob.nextRevision <= todayStr && prob.status)
        if (searchRevision === 'Due' && !isDue) return false
        if (searchRevision === 'Safe' && isDue) return false
      }

      return true
    })
  }, [problems, searchName, searchTopic, searchPattern, searchDifficulty, searchMinRoi, searchCompany, searchConfidence, searchRevision])

  const getDifficultyColor = (diff: string) => {
    if (diff === 'Easy') return 'text-emerald-500 bg-emerald-500/10'
    if (diff === 'Medium') return 'text-amber-500 bg-amber-500/10'
    return 'text-red-500 bg-red-500/10'
  }

  const getStatusIcon = (status: string | null | undefined) => {
    if (status === 'Green') return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
    if (status === 'Yellow') return <AlertTriangle className="w-4 h-4 text-amber-500" />
    if (status === 'Red') return <AlertTriangle className="w-4 h-4 text-red-500" />
    return <HelpCircle className="w-4 h-4 text-muted-foreground/30" />
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
          Search Engine
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Granular problem index querying with single-click preset shortcuts
        </p>
      </div>

      {/* QUICK PRESETS */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          Quick Preset Filters
        </span>
        <div className="flex flex-wrap gap-2">
          {['High ROI', 'Needs Revision', 'Low Confidence', 'Sliding Window', 'Trees', 'FAANG'].map((preset) => (
            <button
              key={preset}
              onClick={() => applyPreset(preset)}
              className="px-3 py-1.5 bg-secondary text-foreground hover:bg-border rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* DETAILED FILTERS COLLAPSIBLE */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          Filter Parameters
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          {/* Problem Name */}
          <div className="flex flex-col gap-1">
            <span className="font-bold text-muted-foreground uppercase tracking-wider">Problem Name / ID</span>
            <input
              type="text"
              placeholder="e.g. Two Sum"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
            />
          </div>

          {/* Company Target */}
          <div className="flex flex-col gap-1">
            <span className="font-bold text-muted-foreground uppercase tracking-wider">Company Target</span>
            <input
              type="text"
              placeholder="e.g. Google"
              value={searchCompany}
              onChange={(e) => setSearchCompany(e.target.value)}
              className="bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
            />
          </div>

          {/* Topic */}
          <div className="flex flex-col gap-1">
            <span className="font-bold text-muted-foreground uppercase tracking-wider">DSA Topic</span>
            <select
              value={searchTopic}
              onChange={(e) => setSearchTopic(e.target.value)}
              className="bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
            >
              {topicsList.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Pattern */}
          <div className="flex flex-col gap-1">
            <span className="font-bold text-muted-foreground uppercase tracking-wider">Pattern Encyclopedia</span>
            <select
              value={searchPattern}
              onChange={(e) => setSearchPattern(e.target.value)}
              className="bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
            >
              {patternsList.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div className="flex flex-col gap-1">
            <span className="font-bold text-muted-foreground uppercase tracking-wider">Difficulty</span>
            <select
              value={searchDifficulty}
              onChange={(e) => setSearchDifficulty(e.target.value)}
              className="bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Confidence */}
          <div className="flex flex-col gap-1">
            <span className="font-bold text-muted-foreground uppercase tracking-wider">Confidence Level</span>
            <select
              value={searchConfidence}
              onChange={(e) => setSearchConfidence(e.target.value)}
              className="bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
            >
              <option value="All">All Levels</option>
              <option value="Low">Low Confidence (1-2 Stars)</option>
              <option value="High">High Confidence (4-5 Stars)</option>
            </select>
          </div>

          {/* Revision */}
          <div className="flex flex-col gap-1">
            <span className="font-bold text-muted-foreground uppercase tracking-wider">Revision Status</span>
            <select
              value={searchRevision}
              onChange={(e) => setSearchRevision(e.target.value)}
              className="bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
            >
              <option value="All">All Problems</option>
              <option value="Due">Overdue/Due Today</option>
              <option value="Safe">Safe (Not Due)</option>
            </select>
          </div>

          {/* Min ROI */}
          <div className="flex flex-col gap-1">
            <span className="font-bold text-muted-foreground uppercase tracking-wider">Minimum ROI: {searchMinRoi}/10</span>
            <input
              type="range"
              min={1}
              max={10}
              value={searchMinRoi}
              onChange={(e) => setSearchMinRoi(parseInt(e.target.value))}
              className="accent-primary h-8 cursor-pointer bg-transparent"
            />
          </div>
        </div>
      </div>

      {/* RESULTS LIST */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-secondary/10 flex justify-between items-center">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Results ({results.length} Matches)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/30 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4 w-16 text-center">ID</th>
                <th className="py-3 px-4">Problem Name</th>
                <th className="py-3 px-4">Topic</th>
                <th className="py-3 px-4">Pattern</th>
                <th className="py-3 px-4 w-24 text-center">Difficulty</th>
                <th className="py-3 px-4 w-16 text-center">ROI</th>
                <th className="py-3 px-4 w-24 text-center">Status</th>
                <th className="py-3 px-4">Company Tags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {results.length > 0 ? (
                results.map((prob) => (
                  <tr 
                    key={prob.id}
                    onClick={() => setActiveProblem(prob)}
                    className="hover:bg-secondary/20 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-medium text-muted-foreground text-center">
                      {prob.id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      {prob.name}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {prob.topic}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {prob.pattern}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getDifficultyColor(prob.difficulty)}`}>
                        {prob.difficulty}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-foreground">
                      {prob.roi}
                    </td>
                    <td className="py-3.5 px-4 text-center flex justify-center py-4">
                      {getStatusIcon(prob.status)}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-muted-foreground max-w-xs truncate">
                      {prob.companyTags || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground font-semibold">
                    No results match these filters. Try weakening your query parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal detail */}
      <ProblemModal 
        problem={activeProblem} 
        onClose={() => setActiveProblem(null)} 
      />
    </motion.div>
  )
}
