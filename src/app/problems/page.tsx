'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, CheckCircle2, AlertTriangle, HelpCircle, ExternalLink } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { Problem } from '@/lib/seedData'
import { ProblemModal } from '@/components/ProblemModal'

export default function ProblemsPage() {
  const { problems } = useData()

  // State filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('All')
  const [selectedPattern, setSelectedPattern] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  // Selected Problem for Modal Drawer
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null)

  // Extract unique filter sources from actual problems
  const topicsList = useMemo(() => {
    const list = Array.from(new Set(problems.map((p) => p.topic)))
    return ['All', ...list.sort()]
  }, [problems])

  const patternsList = useMemo(() => {
    const list = Array.from(new Set(problems.map((p) => p.pattern)))
    return ['All', ...list.sort()]
  }, [problems])

  // Filter problems logic
  const filteredProblems = useMemo(() => {
    setCurrentPage(1) // Reset page on filter change
    return problems.filter((prob) => {
      // 1. Search Query
      const query = searchQuery.toLowerCase()
      const matchesSearch = 
        prob.name.toLowerCase().includes(query) || 
        prob.id.toString().includes(query) ||
        (prob.companyTags && prob.companyTags.toLowerCase().includes(query))

      // 2. Topic
      const matchesTopic = selectedTopic === 'All' || prob.topic === selectedTopic

      // 3. Pattern
      const matchesPattern = selectedPattern === 'All' || prob.pattern === selectedPattern

      // 4. Difficulty
      const matchesDiff = selectedDifficulty === 'All' || prob.difficulty === selectedDifficulty

      // 5. Status
      let matchesStatus = true
      if (selectedStatus === 'Solved') {
        matchesStatus = prob.status !== null && prob.status !== undefined
      } else if (selectedStatus === 'Unsolved') {
        matchesStatus = prob.status === null || prob.status === undefined
      } else if (selectedStatus === 'Due') {
        const todayStr = new Date().toISOString().split('T')[0]
        matchesStatus = !!(prob.nextRevision && prob.nextRevision <= todayStr && prob.status)
      }

      return matchesSearch && matchesTopic && matchesPattern && matchesDiff && matchesStatus
    })
  }, [problems, searchQuery, selectedTopic, selectedPattern, selectedDifficulty, selectedStatus])

  // Pagination logic
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage)
  const paginatedProblems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredProblems.slice(start, start + itemsPerPage)
  }, [filteredProblems, currentPage])

  const getDifficultyColor = (diff: string) => {
    if (diff === 'Easy') return 'text-emerald-500 bg-emerald-500/10'
    if (diff === 'Medium') return 'text-amber-500 bg-amber-500/10'
    return 'text-red-500 bg-red-500/10'
  }

  const getStatusIcon = (status: string | null | undefined) => {
    if (status === 'Green') return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
    if (status === 'Yellow') return <AlertTriangle className="w-4 h-4 text-amber-500" />
    if (status === 'Red') return <AlertTriangle className="w-4 h-4 text-red-500" />
    return <HelpCircle className="w-4 h-4 text-muted-foreground/40" />
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
          Master Database
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Complete pre-seeded repository of {problems.length} high-ROI placement questions
        </p>
      </div>

      {/* FILTER BAR PANEL */}
      <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4 shadow-sm">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search problems by name, ID, or company tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-secondary/50 border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {/* Topic */}
          <div className="flex flex-col gap-1">
            <span className="font-bold text-muted-foreground uppercase tracking-wider">DSA Topic</span>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="bg-secondary/50 border border-border rounded-lg px-3 py-2 text-foreground font-medium focus:outline-none"
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
              value={selectedPattern}
              onChange={(e) => setSelectedPattern(e.target.value)}
              className="bg-secondary/50 border border-border rounded-lg px-3 py-2 text-foreground font-medium focus:outline-none"
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
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-secondary/50 border border-border rounded-lg px-3 py-2 text-foreground font-medium focus:outline-none"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Solve Status */}
          <div className="flex flex-col gap-1">
            <span className="font-bold text-muted-foreground uppercase tracking-wider">Solve Status</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-secondary/50 border border-border rounded-lg px-3 py-2 text-foreground font-medium focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Solved">Solved</option>
              <option value="Unsolved">Unsolved</option>
              <option value="Due">Needs Revision</option>
            </select>
          </div>
        </div>
      </div>

      {/* PROBLEMS TABLE */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
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
                <th className="py-3 px-4 w-24">Next Rev</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {paginatedProblems.length > 0 ? (
                paginatedProblems.map((prob) => (
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
                    <td className="py-3.5 px-4 text-xs font-mono text-muted-foreground">
                      {prob.nextRevision || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground font-semibold">
                    No problems match your filter selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION PANEL */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-border bg-secondary/10">
            <span className="text-xs font-medium text-muted-foreground">
              Showing page <strong className="text-foreground">{currentPage}</strong> of <strong className="text-foreground">{totalPages}</strong> ({filteredProblems.length} results)
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 border border-border rounded-lg text-xs font-semibold text-muted-foreground bg-card hover:bg-secondary hover:text-foreground disabled:opacity-50 transition-all"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 border border-border rounded-lg text-xs font-semibold text-muted-foreground bg-card hover:bg-secondary hover:text-foreground disabled:opacity-50 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Problem Details Drawer Modal */}
      <ProblemModal 
        problem={activeProblem} 
        onClose={() => setActiveProblem(null)} 
      />
    </motion.div>
  )
}
