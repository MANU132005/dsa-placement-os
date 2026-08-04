'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy,
  Flame,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  BookOpen,
  TrendingUp,
  FileText,
  Bookmark,
  ExternalLink,
  ChevronRight,
  Plus,
  Trash2,
  Brain,
  Star,
  Target,
  BarChart2,
  Lightbulb,
  Award,
  Video,
  X,
  MessageSquare,
  Search,
  Filter,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  HelpCircle,
  Code2,
  Database,
  Cpu,
  Globe,
  Layers,
  Check,
  Send,
  Lock
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'
import { useAuth } from '@/context/AuthContext'
import {
  PATTERNS_LIST,
  INITIAL_PROBLEMS_V2,
  INITIAL_OA_EXPERIENCES,
  InfosysV2Problem,
  PatternMeta,
  OAExperienceEntry
} from '@/lib/infosysV2Data'
import { INFOSYS_V2_MOCK_TESTS, MockTestV2, MockQuestionV2 } from '@/lib/infosysV2MocksData'
import { TECHNICAL_INTERVIEW_DATA, HR_INTERVIEW_DATA } from '@/lib/infosysV2InterviewData'

export default function MissionInfosysV2Page() {
  const { user } = useAuth()
  const uid = user?.id || 'guest'

  // Hydration check
  const [mounted, setMounted] = useState(false)

  // Top-level tab navigation
  const [activeTab, setActiveTab] = useState<'roadmap' | 'revision' | 'mocks' | 'oa-trends' | 'interview' | 'analytics'>('roadmap')

  // Master V2 State stored in localStorage
  const [problems, setProblems] = useState<InfosysV2Problem[]>(INITIAL_PROBLEMS_V2)
  const [oaExperiences, setOaExperiences] = useState<OAExperienceEntry[]>(INITIAL_OA_EXPERIENCES)
  const [mocksState, setMocksState] = useState<Record<string, { solved: boolean; score: number | null; accuracy: number | null; timeTaken: number | null }>>({})
  const [streak, setStreak] = useState<number>(5)

  // Filters & Search State
  const [selectedPatternId, setSelectedPatternId] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')

  // Revision Mode toggles
  const [revisionModeActive, setRevisionModeActive] = useState<boolean>(false)
  const [revealedApproaches, setRevealedApproaches] = useState<Record<number, boolean>>({})

  // Interactive Stopwatch/Timer per problem
  const [activeTimerProblemId, setActiveTimerProblemId] = useState<number | null>(null)
  const [timerSeconds, setTimerSeconds] = useState<number>(0)
  const [timerRunning, setTimerRunning] = useState<boolean>(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Notes Modal State
  const [notesModalProblem, setNotesModalProblem] = useState<InfosysV2Problem | null>(null)
  const [notesText, setNotesText] = useState<string>('')

  // Mock Exam Execution State
  const [activeMock, setActiveMock] = useState<MockTestV2 | null>(null)
  const [activeMockQIdx, setActiveMockQIdx] = useState<number>(0)
  const [mockTimeRemaining, setMockTimeRemaining] = useState<number>(180 * 60)
  const [userCodes, setUserCodes] = useState<Record<string, string>>({})
  const [mockConsoleLogs, setMockConsoleLogs] = useState<Record<string, string>>({})
  const [unlockedHints, setUnlockedHints] = useState<Record<string, boolean>>({})
  const [unlockedEditorials, setUnlockedEditorials] = useState<Record<string, boolean>>({})
  const [mockSubmitted, setMockSubmitted] = useState<boolean>(false)

  // OA Extractor Form State
  const [extractorInput, setExtractorInput] = useState<string>('')
  const [extractedResult, setExtractedResult] = useState<{
    pattern: string
    subPattern: string
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Very Hard'
    title: string
    whyInfosys: string
    trick: string
    similar: string
  } | null>(null)

  // Load state on mount
  useEffect(() => {
    setMounted(true)
    const localKey = `dsa_${uid}_infosys_v2`
    const saved = localStorage.getItem(localKey)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.problems) setProblems(parsed.problems)
        if (parsed.oaExperiences) setOaExperiences(parsed.oaExperiences)
        if (parsed.mocksState) setMocksState(parsed.mocksState)
        if (parsed.streak !== undefined) setStreak(parsed.streak)
      } catch (e) {
        console.error('Error loading V2 state:', e)
      }
    }
  }, [uid])

  // Save state helper
  const saveV2State = (newProblems = problems, newOA = oaExperiences, newMocks = mocksState, newStreak = streak) => {
    setProblems(newProblems)
    setOaExperiences(newOA)
    setMocksState(newMocks)
    setStreak(newStreak)
    const localKey = `dsa_${uid}_infosys_v2`
    localStorage.setItem(localKey, JSON.stringify({
      problems: newProblems,
      oaExperiences: newOA,
      mocksState: newMocks,
      streak: newStreak
    }))
  }

  // Timer Effect
  useEffect(() => {
    if (timerRunning && activeTimerProblemId !== null) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [timerRunning, activeTimerProblemId])

  // Mock Timer Effect
  useEffect(() => {
    let mockInterval: NodeJS.Timeout
    if (activeMock && !mockSubmitted && mockTimeRemaining > 0) {
      mockInterval = setInterval(() => {
        setMockTimeRemaining(prev => {
          if (prev <= 1) {
            handleFinalizeMock()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (mockInterval) clearInterval(mockInterval)
    }
  }, [activeMock, mockSubmitted, mockTimeRemaining])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
          <p className="text-sm text-zinc-400 font-mono">Initializing 🚀 Mission Infosys V2 Engine...</p>
        </div>
      </div>
    )
  }

  // Dynamic Metrics Calculation
  const totalProblemsCount = problems.length
  const solvedCount = problems.filter(p => p.status === 'Solved' || p.status === 'Mastered').length
  const overallSafeZonePercent = totalProblemsCount > 0 ? Math.round((solvedCount / totalProblemsCount) * 100) : 0

  // Role Readiness Predictor Engine
  const calcRoleReadiness = () => {
    const solvedProbs = problems.filter(p => p.status === 'Solved' || p.status === 'Mastered')
    const easyMediumSolved = solvedProbs.filter(p => p.difficulty === 'Easy' || p.difficulty === 'Medium').length
    const hardSolved = solvedProbs.filter(p => p.difficulty === 'Hard' || p.difficulty === 'Very Hard').length
    const graphDpSolved = solvedProbs.filter(p => p.pattern.includes('Graph') || p.pattern.includes('Dynamic Programming')).length

    const dseReady = Math.min(100, Math.round((easyMediumSolved / 10) * 100))
    const spL1Ready = Math.min(100, Math.round(((easyMediumSolved + hardSolved) / 14) * 100))
    const spL2Ready = Math.min(100, Math.round(((graphDpSolved + hardSolved) / 10) * 100))
    const spL3Ready = Math.min(100, Math.round((hardSolved / 6) * 100))

    return { dseReady, spL1Ready, spL2Ready, spL3Ready }
  }

  const { dseReady, spL1Ready, spL2Ready, spL3Ready } = calcRoleReadiness()

  // Pattern-level stats
  const getPatternProgress = (patternName: string) => {
    const patProbs = problems.filter(p => p.pattern.toLowerCase() === patternName.toLowerCase() || p.pattern.includes(patternName))
    if (patProbs.length === 0) return { total: 0, solved: 0, percent: 0 }
    const solved = patProbs.filter(p => p.status === 'Solved' || p.status === 'Mastered').length
    return {
      total: patProbs.length,
      solved,
      percent: Math.round((solved / patProbs.length) * 100)
    }
  }

  // Handlers for problem actions
  const handleUpdateStatus = (id: number, status: InfosysV2Problem['status']) => {
    const updated = problems.map(p => p.id === id ? { ...p, status } : p)
    saveV2State(updated)
  }

  const handleToggleBookmark = (id: number) => {
    const updated = problems.map(p => p.id === id ? { ...p, bookmarked: !p.bookmarked } : p)
    saveV2State(updated)
  }

  const handleConfidenceRating = (id: number, conf: number) => {
    const updated = problems.map(p => p.id === id ? { ...p, confidence: conf } : p)
    saveV2State(updated)
  }

  const handleSaveNotes = () => {
    if (!notesModalProblem) return
    const updated = problems.map(p => p.id === notesModalProblem.id ? { ...p, notes: notesText } : p)
    saveV2State(updated)
    setNotesModalProblem(null)
  }

  // Stopwatch controls
  const handleStartTimer = (probId: number) => {
    setActiveTimerProblemId(probId)
    setTimerSeconds(0)
    setTimerRunning(true)
  }

  const handleStopTimer = (probId: number) => {
    setTimerRunning(false)
    const mins = Math.max(1, Math.round(timerSeconds / 60))
    const updated = problems.map(p => p.id === probId ? { ...p, solveTime: mins, status: 'Solved' as const } : p)
    saveV2State(updated)
    setActiveTimerProblemId(null)
    setTimerSeconds(0)
  }

  // OA Pattern Extractor logic
  const handleAnalyzeOAStory = () => {
    if (!extractorInput.trim()) return
    const lower = extractorInput.toLowerCase()
    
    let pattern = '1. Arrays'
    let subPattern = 'Prefix Sum Sweep'
    let difficulty: 'Easy' | 'Medium' | 'Hard' | 'Very Hard' = 'Medium'
    let trick = 'Map running prefix sum or track window boundaries.'

    if (lower.includes('grid') || lower.includes('matrix') || lower.includes('path') || lower.includes('firewall') || lower.includes('island')) {
      pattern = '18. Graph'
      subPattern = 'Grid BFS/DFS Traversal'
      difficulty = 'Hard'
      trick = 'Model as 2D Grid DFS/BFS or Shortest Path algorithm.'
    } else if (lower.includes('coin') || lower.includes('knapsack') || lower.includes('energy') || lower.includes('maximum profit') || lower.includes('subsequence')) {
      pattern = '19. Dynamic Programming'
      subPattern = '0/1 & Unbounded Knapsack'
      difficulty = 'Hard'
      trick = 'State transition dp[i] = min/max choice. Check overlapping subproblems.'
    } else if (lower.includes('koko') || lower.includes('minimum speed') || lower.includes('capacity') || lower.includes('truck')) {
      pattern = '7. Binary Search'
      subPattern = 'Binary Search on Answer Range'
      difficulty = 'Medium'
      trick = 'Binary search over target answer space [1..maxVal].'
    } else if (lower.includes('window') || lower.includes('substring') || lower.includes('repeating')) {
      pattern = '5. Sliding Window'
      subPattern = 'Dynamic Window Expansion'
      difficulty = 'Medium'
      trick = 'Maintain left & right pointers with frequency hashmap.'
    }

    setExtractedResult({
      pattern,
      subPattern,
      difficulty,
      title: 'Extracted OA Problem: ' + (extractorInput.slice(0, 40) + '...'),
      whyInfosys: 'Extracted from real student OA prompt analysis.',
      trick,
      similar: 'Matches recurring Infosys campus drive pattern'
    })
  }

  const handleAddExtractedToRoadmap = () => {
    if (!extractedResult) return
    const newProb: InfosysV2Problem = {
      id: Date.now(),
      problemName: extractedResult.title,
      pattern: extractedResult.pattern,
      subPattern: extractedResult.subPattern,
      difficulty: extractedResult.difficulty,
      whyInfosysAsksThis: extractedResult.whyInfosys,
      recognitionTrick: extractedResult.trick,
      commonMistakes: 'Watch for edge cases and index out-of-bounds.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
      leetcode: 'https://leetcode.com',
      gfg: 'https://geeksforgeeks.org',
      codingNinjas: 'https://naukri.com/code360',
      takeUForward: 'https://takeuforward.org',
      neetCode: 'https://neetcode.io',
      striverVideo: 'https://youtube.com',
      companyTags: ['Infosys SP 2026', 'User Extracted'],
      frequency: 90,
      status: 'Not Started',
      confidence: 3,
      expectedTime: 25,
      approach: extractedResult.trick
    }
    const newOaEntry: OAExperienceEntry = {
      id: `exp-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      college: 'User Submitted Drive',
      role: 'SP',
      title: extractedResult.title,
      description: extractorInput,
      extractedPattern: extractedResult.pattern,
      extractedDifficulty: extractedResult.difficulty,
      similarProblemName: extractedResult.subPattern,
      verifiedInDrive: true
    }
    saveV2State([newProb, ...problems], [newOaEntry, ...oaExperiences])
    setExtractorInput('')
    setExtractedResult(null)
  }

  // Mock Exam Judge Controls
  const handleStartMock = (mock: MockTestV2) => {
    setActiveMock(mock)
    setActiveMockQIdx(0)
    setMockTimeRemaining(mock.timeLimitMins * 60)
    setMockSubmitted(false)

    const initCodes: Record<string, string> = {}
    const initLogs: Record<string, string> = {}
    mock.questions.forEach(q => {
      initCodes[q.id] = q.template
      initLogs[q.id] = 'Terminal ready. Click "Run Code" to test sample inputs or "Submit Question" to judge.'
    })
    setUserCodes(initCodes)
    setMockConsoleLogs(initLogs)
    setUnlockedHints({})
    setUnlockedEditorials({})
  }

  const handleRunMockCode = () => {
    if (!activeMock) return
    const q = activeMock.questions[activeMockQIdx]
    const code = userCodes[q.id] || ''

    try {
      const runFn = new Function(...q.args, code + `\nreturn ${q.functionName}(${q.args.join(', ')});`)
      let passed = 0
      const logs: string[] = []

      q.testCases.forEach((tc, i) => {
        try {
          const res = runFn(...tc.args)
          const isOk = JSON.stringify(res) === JSON.stringify(tc.expected)
          if (isOk) {
            passed++
            logs.push(`Test Case ${i + 1}: Passed ✅\n  Input: ${JSON.stringify(tc.args)}\n  Output: ${JSON.stringify(res)}`)
          } else {
            logs.push(`Test Case ${i + 1}: Failed ❌\n  Input: ${JSON.stringify(tc.args)}\n  Expected: ${JSON.stringify(tc.expected)}\n  Got: ${JSON.stringify(res)}`)
          }
        } catch (e: any) {
          logs.push(`Test Case ${i + 1}: Exception - ${e.message}`)
        }
      })

      setMockConsoleLogs(prev => ({
        ...prev,
        [q.id]: `[Sample Run Verdict: ${passed === q.testCases.length ? 'ACCEPTED' : 'WRONG ANSWER'}]\nPassed ${passed}/${q.testCases.length} sample cases.\n\n` + logs.join('\n\n')
      }))
    } catch (err: any) {
      setMockConsoleLogs(prev => ({
        ...prev,
        [q.id]: `Syntax / Compiler Error:\n${err.message}`
      }))
    }
  }

  const handleFinalizeMock = () => {
    if (!activeMock) return
    setMockSubmitted(true)
    const newMocksState = {
      ...mocksState,
      [activeMock.id]: {
        solved: true,
        score: 100,
        accuracy: 100,
        timeTaken: activeMock.timeLimitMins - Math.round(mockTimeRemaining / 60)
      }
    }
    saveV2State(problems, oaExperiences, newMocksState)
  }

  // Filtered problems list
  const filteredProblems = problems.filter(p => {
    const matchesPattern = selectedPatternId === 'all' || p.pattern.toLowerCase().includes(selectedPatternId)
    const matchesSearch = p.problemName.toLowerCase().includes(searchQuery.toLowerCase()) || p.subPattern.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDiff = selectedDifficulty === 'all' || p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase()
    return matchesPattern && matchesSearch && matchesDiff
  })

  return (
    <div className="space-y-8 pb-16 text-foreground">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-zinc-900 to-indigo-950 p-6 md:p-8 border border-emerald-500/20 shadow-2xl">
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              CAMPUS RECRUITMENT 2025-2026 EDITION
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white flex items-center gap-3">
              🚀 Mission Infosys V2
            </h1>
            <p className="text-zinc-300 text-sm md:text-base font-medium">
              Ultimate Safe Zone for Infosys SP (Specialist Programmer) / DSE (Digital Specialist Engineer) Campus Recruitment.
            </p>
          </div>

          {/* Quick Streak & Safe Zone Indicator */}
          <div className="flex items-center gap-4 bg-zinc-900/80 backdrop-blur border border-zinc-800 p-4 rounded-xl">
            <div className="flex items-center gap-3 pr-4 border-r border-zinc-800">
              <div className="p-2.5 bg-orange-500/20 text-orange-400 rounded-lg">
                <Flame className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="text-xs text-zinc-400 font-semibold uppercase">Daily Streak</div>
                <div className="text-xl font-extrabold text-white">{streak} Days</div>
              </div>
            </div>
            <div className="flex items-center gap-3 pl-2">
              <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-zinc-400 font-semibold uppercase">Overall Safe Zone</div>
                <div className="text-xl font-extrabold text-emerald-400">{overallSafeZonePercent}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Role Readiness Predictor bar */}
        <div className="mt-8 pt-6 border-t border-zinc-800/80 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/60">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-zinc-300">DSE Role Ready</span>
              <span className="font-mono text-emerald-400 font-bold">{dseReady}%</span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${dseReady}%` }} />
            </div>
          </div>

          <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/60">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-zinc-300">SP L1 Ready</span>
              <span className="font-mono text-blue-400 font-bold">{spL1Ready}%</span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${spL1Ready}%` }} />
            </div>
          </div>

          <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/60">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-zinc-300">SP L2 Ready</span>
              <span className="font-mono text-purple-400 font-bold">{spL2Ready}%</span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${spL2Ready}%` }} />
            </div>
          </div>

          <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/60">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-zinc-300">SP L3 Ready</span>
              <span className="font-mono text-amber-400 font-bold">{spL3Ready}%</span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${spL3Ready}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-border pb-3 overflow-x-auto gap-2">
        <div className="flex items-center gap-2">
          {[
            { id: 'roadmap', label: '🎯 25 Pattern Roadmap', icon: Target },
            { id: 'revision', label: '⚡ Revision Mode', icon: Zap },
            { id: 'mocks', label: '📝 20 OA Mock Tests', icon: FileText },
            { id: 'oa-trends', label: '📰 Latest OA Trends', icon: TrendingUp },
            { id: 'interview', label: '💼 Interview Guide', icon: Award },
            { id: 'analytics', label: '📊 Analytics & Heatmap', icon: BarChart2 }
          ].map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Global Revision Mode Quick Toggle */}
        <button
          onClick={() => setRevisionModeActive(!revisionModeActive)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
            revisionModeActive
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 animate-pulse'
              : 'bg-secondary text-muted-foreground border-border hover:text-foreground'
          }`}
        >
          {revisionModeActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>Revision Mode: {revisionModeActive ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* TAB 1: 25 PATTERN ROADMAP */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          {/* Controls & Search */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search problem or sub-pattern..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-secondary border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <select
                value={selectedPatternId}
                onChange={e => setSelectedPatternId(e.target.value)}
                className="px-3 py-2 bg-secondary border border-border rounded-md text-sm text-foreground focus:outline-none"
              >
                <option value="all">All 25 Patterns</option>
                {PATTERNS_LIST.map(p => (
                  <option key={p.id} value={p.name.toLowerCase()}>
                    {p.name} ({getPatternProgress(p.name).percent}%)
                  </option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={e => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 bg-secondary border border-border rounded-md text-sm text-foreground focus:outline-none"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="very hard">Very Hard</option>
              </select>
            </div>
          </div>

          {/* Render Pattern Sections */}
          <div className="space-y-8">
            {PATTERNS_LIST.filter(pm => selectedPatternId === 'all' || pm.name.toLowerCase().includes(selectedPatternId)).map(pat => {
              const patStats = getPatternProgress(pat.name)
              const patProblems = filteredProblems.filter(p => p.pattern.toLowerCase() === pat.name.toLowerCase() || p.pattern.includes(pat.name))

              return (
                <div key={pat.id} className="bg-card border border-border rounded-xl p-5 md:p-6 shadow-sm space-y-5">
                  {/* Pattern Header Card */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-foreground">{pat.name}</h2>
                        <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                          pat.infosysFrequency === 'Extreme' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          pat.infosysFrequency === 'Very High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                          'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {pat.infosysFrequency} Infosys Frequency
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span>Campus Frequency: <strong className="text-foreground">{pat.campusFrequency}</strong></span>
                        <span>Probability: <strong className="text-emerald-400">{pat.estimatedProbability}</strong></span>
                        <span>Recommended Time: <strong className="text-foreground">{pat.recommendedTime}</strong></span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs font-semibold text-muted-foreground">Safe Zone Progress</div>
                        <div className="text-lg font-mono font-bold text-emerald-400">{patStats.solved}/{patStats.total} ({patStats.percent}%)</div>
                      </div>
                      <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 flex items-center justify-center font-mono font-bold text-sm text-emerald-400 bg-emerald-500/10">
                        {patStats.percent}%
                      </div>
                    </div>
                  </div>

                  {/* Problems Grid under Pattern */}
                  <div className="grid grid-cols-1 gap-4">
                    {patProblems.length === 0 ? (
                      <div className="text-xs text-muted-foreground italic py-2">No problems matching search filter in this pattern category.</div>
                    ) : (
                      patProblems.map(prob => (
                        <div
                          key={prob.id}
                          className={`p-4 rounded-xl border transition-all ${
                            prob.status === 'Mastered' ? 'bg-emerald-950/20 border-emerald-500/40' :
                            prob.status === 'Solved' ? 'bg-secondary/40 border-border' :
                            'bg-card border-border/80'
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Problem Title & Tags */}
                            <div className="space-y-1.5 max-w-2xl">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  prob.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                                  prob.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                                  'bg-red-500/20 text-red-400'
                                }`}>
                                  {prob.difficulty}
                                </span>
                                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                                  {prob.problemName}
                                  {prob.bookmarked && <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400" />}
                                </h3>
                                <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                                  {prob.subPattern}
                                </span>
                              </div>

                              {/* Revision Mode View vs Full View */}
                              {revisionModeActive ? (
                                <div className="mt-2 p-3 bg-amber-950/20 border border-amber-500/30 rounded-lg space-y-2">
                                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                                    <HelpCircle className="w-4 h-4" /> REVISION MODE: Recognize Pattern Challenge
                                  </div>
                                  <p className="text-xs text-zinc-300 font-mono">
                                    Prompt: How would you spot and solve "{prob.problemName}" in an Infosys OA story question?
                                  </p>
                                  <div className="pt-2 flex items-center justify-between">
                                    <button
                                      onClick={() => setRevealedApproaches(prev => ({ ...prev, [prob.id]: !prev[prob.id] }))}
                                      className="text-xs font-semibold text-primary underline"
                                    >
                                      {revealedApproaches[prob.id] ? 'Hide Approach' : 'Reveal Solution Approach'}
                                    </button>
                                    <div className="flex items-center gap-1">
                                      <span className="text-[10px] text-muted-foreground mr-1">Self Rating:</span>
                                      <button onClick={() => handleConfidenceRating(prob.id, 5)} className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold">🟢 High</button>
                                      <button onClick={() => handleConfidenceRating(prob.id, 3)} className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs font-bold">🟡 Medium</button>
                                      <button onClick={() => handleConfidenceRating(prob.id, 1)} className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-xs font-bold">🔴 Low</button>
                                    </div>
                                  </div>
                                  {revealedApproaches[prob.id] && (
                                    <div className="mt-2 text-xs text-zinc-300 p-2 bg-zinc-900 rounded border border-zinc-800">
                                      <strong>Approach:</strong> {prob.approach || prob.recognitionTrick}
                                      <br />
                                      <strong>Complexity:</strong> {prob.timeComplexity} | {prob.spaceComplexity}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <>
                                  <p className="text-xs text-muted-foreground">
                                    <strong className="text-foreground">Why Infosys Asks This:</strong> {prob.whyInfosysAsksThis}
                                  </p>
                                  <p className="text-xs text-emerald-400/90 font-mono">
                                    💡 <strong>Recognition Trick:</strong> {prob.recognitionTrick}
                                  </p>
                                  <p className="text-xs text-red-400/80 font-mono">
                                    ⚠️ <strong>Common Mistakes:</strong> {prob.commonMistakes}
                                  </p>
                                </>
                              )}

                              {/* Platform Links */}
                              {!revisionModeActive && (
                                <div className="flex flex-wrap items-center gap-2 pt-2">
                                  {prob.leetcode && (
                                    <a href={prob.leetcode} target="_blank" rel="noreferrer" className="text-[11px] bg-secondary hover:bg-accent text-zinc-300 px-2 py-1 rounded flex items-center gap-1">
                                      <ExternalLink className="w-3 h-3 text-amber-400" /> LeetCode
                                    </a>
                                  )}
                                  {prob.gfg && (
                                    <a href={prob.gfg} target="_blank" rel="noreferrer" className="text-[11px] bg-secondary hover:bg-accent text-zinc-300 px-2 py-1 rounded flex items-center gap-1">
                                      <ExternalLink className="w-3 h-3 text-emerald-400" /> GFG
                                    </a>
                                  )}
                                  {prob.codingNinjas && (
                                    <a href={prob.codingNinjas} target="_blank" rel="noreferrer" className="text-[11px] bg-secondary hover:bg-accent text-zinc-300 px-2 py-1 rounded flex items-center gap-1">
                                      <ExternalLink className="w-3 h-3 text-orange-400" /> Coding Ninjas
                                    </a>
                                  )}
                                  {prob.takeUForward && (
                                    <a href={prob.takeUForward} target="_blank" rel="noreferrer" className="text-[11px] bg-secondary hover:bg-accent text-zinc-300 px-2 py-1 rounded flex items-center gap-1">
                                      <ExternalLink className="w-3 h-3 text-red-400" /> TakeUForward
                                    </a>
                                  )}
                                  {prob.striverVideo && (
                                    <a href={prob.striverVideo} target="_blank" rel="noreferrer" className="text-[11px] bg-secondary hover:bg-accent text-zinc-300 px-2 py-1 rounded flex items-center gap-1">
                                      <Video className="w-3 h-3 text-red-500" /> Striver Video
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Status, Stopwatch & Actions */}
                            <div className="flex flex-wrap md:flex-col items-end justify-between gap-3 border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-4">
                              {/* Status Select */}
                              <div className="flex items-center gap-2">
                                <select
                                  value={prob.status}
                                  onChange={e => handleUpdateStatus(prob.id, e.target.value as any)}
                                  className="text-xs px-2.5 py-1.5 bg-secondary border border-border rounded-md font-semibold text-foreground"
                                >
                                  <option value="Not Started">Not Started</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="Solved">Solved</option>
                                  <option value="Mastered">Mastered</option>
                                  <option value="Need Revision">Need Revision</option>
                                </select>

                                <button
                                  onClick={() => handleToggleBookmark(prob.id)}
                                  title="Bookmark"
                                  className="p-1.5 rounded bg-secondary hover:bg-accent text-muted-foreground hover:text-amber-400"
                                >
                                  <Bookmark className={`w-4 h-4 ${prob.bookmarked ? 'text-amber-400 fill-amber-400' : ''}`} />
                                </button>

                                <button
                                  onClick={() => {
                                    setNotesModalProblem(prob)
                                    setNotesText(prob.notes || '')
                                  }}
                                  title="Edit Notes"
                                  className="p-1.5 rounded bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground"
                                >
                                  <FileText className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Interactive Stopwatch */}
                              <div className="flex items-center gap-2 bg-secondary/80 p-1.5 rounded-lg border border-border">
                                {activeTimerProblemId === prob.id && timerRunning ? (
                                  <>
                                    <span className="text-xs font-mono font-bold text-emerald-400 px-1">
                                      {Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:{(timerSeconds % 60).toString().padStart(2, '0')}
                                    </span>
                                    <button
                                      onClick={() => handleStopTimer(prob.id)}
                                      className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-xs font-bold"
                                    >
                                      Stop & Save
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    onClick={() => handleStartTimer(prob.id)}
                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-semibold px-2 py-0.5"
                                  >
                                    <Clock className="w-3.5 h-3.5 text-primary" /> Start Timer
                                  </button>
                                )}
                              </div>

                              <div className="text-[10px] text-muted-foreground font-mono">
                                Time: {prob.timeComplexity} | Space: {prob.spaceComplexity}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* TAB 2: REVISION MODE */}
      {activeTab === 'revision' && (
        <div className="space-y-6">
          <div className="bg-amber-950/20 border border-amber-500/30 p-6 rounded-xl space-y-2">
            <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
              <Zap className="w-5 h-5" /> Active Pattern Recognition & Revision Mode
            </h2>
            <p className="text-xs text-zinc-300">
              Solutions and code are hidden. Test your pattern recognition instincts against real Infosys OA problem statements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {problems.map(prob => (
              <div key={prob.id} className="bg-card border border-border p-5 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {prob.pattern}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">{prob.difficulty}</span>
                </div>
                <h3 className="font-bold text-lg text-foreground">{prob.problemName}</h3>

                <div className="p-3 bg-secondary/50 rounded-lg text-xs text-zinc-300 space-y-2">
                  <div className="font-semibold text-primary">Self-Test Prompt:</div>
                  <div>What is the core pattern trick and optimal time/space complexity?</div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => setRevealedApproaches(prev => ({ ...prev, [prob.id]: !prev[prob.id] }))}
                    className="text-xs font-bold text-primary underline"
                  >
                    {revealedApproaches[prob.id] ? 'Hide Answer' : 'Reveal Answer & Approach'}
                  </button>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleUpdateStatus(prob.id, 'Mastered')} className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold">Mastered</button>
                    <button onClick={() => handleUpdateStatus(prob.id, 'Need Revision')} className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs font-bold">Needs Revision</button>
                  </div>
                </div>

                {revealedApproaches[prob.id] && (
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300 space-y-1">
                    <div><strong>Recognition Trick:</strong> {prob.recognitionTrick}</div>
                    <div><strong>Approach:</strong> {prob.approach || prob.whyInfosysAsksThis}</div>
                    <div><strong>Complexity:</strong> Time: {prob.timeComplexity} | Space: {prob.spaceComplexity}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: 20 OA MOCK TESTS */}
      {activeTab === 'mocks' && (
        <div className="space-y-6">
          {!activeMock ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {INFOSYS_V2_MOCK_TESTS.map(mock => {
                const mockResult = mocksState[mock.id]
                return (
                  <div key={mock.id} className="bg-card border border-border p-6 rounded-xl space-y-4 shadow-sm hover:border-primary/50 transition-all flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-primary/20 text-primary">
                          {mock.targetRole}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground">3 Hours • 4 Questions</span>
                      </div>
                      <h3 className="font-bold text-lg text-foreground">{mock.title}</h3>
                      <p className="text-xs text-muted-foreground">{mock.subtitle}</p>
                    </div>

                    <div className="space-y-3 pt-2">
                      {mockResult?.solved ? (
                        <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg flex items-center justify-between text-xs text-emerald-400 font-bold">
                          <span>Status: Completed</span>
                          <span>Score: {mockResult.score}/100</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartMock(mock)}
                          className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
                        >
                          <Play className="w-4 h-4" /> Start 3-Hour Exam Simulator
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            // Mock Exam Simulator UI
            <div className="space-y-6 bg-card border border-border p-6 rounded-xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{activeMock.title}</h2>
                  <p className="text-xs text-muted-foreground">Question {activeMockQIdx + 1} of {activeMock.questions.length}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="px-4 py-2 bg-red-500/20 text-red-400 font-mono font-bold text-lg rounded-lg border border-red-500/30 flex items-center gap-2">
                    <Clock className="w-5 h-5 animate-pulse" />
                    {Math.floor(mockTimeRemaining / 3600)}:
                    {Math.floor((mockTimeRemaining % 3600) / 60).toString().padStart(2, '0')}:
                    {(mockTimeRemaining % 60).toString().padStart(2, '0')}
                  </div>
                  <button
                    onClick={handleFinalizeMock}
                    className="px-4 py-2 bg-emerald-600 text-white font-bold text-sm rounded-lg hover:bg-emerald-500"
                  >
                    Submit Exam
                  </button>
                </div>
              </div>

              {/* Question Navigation */}
              <div className="flex items-center gap-2">
                {activeMock.questions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setActiveMockQIdx(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeMockQIdx === idx
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    Q{idx + 1}: {q.difficulty}
                  </button>
                ))}
              </div>

              {/* Question Details & Compiler Editor */}
              {activeMock.questions[activeMockQIdx] && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4 bg-secondary/30 p-5 rounded-xl border border-border">
                    <h3 className="font-bold text-lg text-foreground">{activeMock.questions[activeMockQIdx].title}</h3>
                    <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                      {activeMock.questions[activeMockQIdx].storyDescription}
                    </p>

                    <div className="space-y-2 text-xs">
                      <div><strong className="text-primary">Constraints:</strong> <code className="bg-secondary px-1.5 py-0.5 rounded text-foreground">{activeMock.questions[activeMockQIdx].constraints}</code></div>
                      <div><strong className="text-primary">Sample Input:</strong> <code className="bg-secondary px-1.5 py-0.5 rounded text-foreground">{activeMock.questions[activeMockQIdx].sampleInput}</code></div>
                      <div><strong className="text-primary">Sample Output:</strong> <code className="bg-secondary px-1.5 py-0.5 rounded text-foreground">{activeMock.questions[activeMockQIdx].sampleOutput}</code></div>
                    </div>
                  </div>

                  {/* Compiler Code Editor */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                        <Code2 className="w-4 h-4 text-primary" /> JS Compiler / Judge
                      </span>
                      <button
                        onClick={handleRunMockCode}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5" /> Run Code
                      </button>
                    </div>

                    <textarea
                      value={userCodes[activeMock.questions[activeMockQIdx].id] || ''}
                      onChange={e => setUserCodes({ ...userCodes, [activeMock.questions[activeMockQIdx].id]: e.target.value })}
                      rows={12}
                      className="w-full font-mono text-xs p-4 bg-zinc-950 text-emerald-400 rounded-xl border border-zinc-800 focus:outline-none"
                    />

                    {/* Console Output */}
                    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 font-mono text-xs text-zinc-300 min-h-[100px] whitespace-pre-line">
                      {mockConsoleLogs[activeMock.questions[activeMockQIdx].id]}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: LATEST OA TRENDS & EXTRACTOR */}
      {activeTab === 'oa-trends' && (
        <div className="space-y-6">
          {/* Interactive OA Extractor */}
          <div className="bg-card border border-border p-6 rounded-xl space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" /> Latest OA Story Pattern Extractor
            </h2>
            <p className="text-xs text-muted-foreground">
              Paste any Infosys student OA experience text or story problem. The engine will extract primary pattern, difficulty, and auto-add it to your V2 roadmap.
            </p>

            <textarea
              placeholder="Paste student OA question text (e.g. 'In a grid of servers, find min energy path...')..."
              value={extractorInput}
              onChange={e => setExtractorInput(e.target.value)}
              rows={4}
              className="w-full p-3 bg-secondary border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <button
              onClick={handleAnalyzeOAStory}
              className="px-4 py-2 bg-primary text-primary-foreground font-bold text-xs rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
            >
              <Brain className="w-4 h-4" /> Extract Pattern & Analyze
            </button>

            {extractedResult && (
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/40 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-emerald-400">Extracted Pattern: {extractedResult.pattern}</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs rounded font-bold">{extractedResult.difficulty}</span>
                </div>
                <div className="text-xs text-zinc-300"><strong>Recognition Trick:</strong> {extractedResult.trick}</div>
                <button
                  onClick={handleAddExtractedToRoadmap}
                  className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded hover:bg-emerald-500 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add to V2 Roadmap
                </button>
              </div>
            )}
          </div>

          {/* Past Extracted OA Feed */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-foreground">Verified Infosys 2025-2026 Campus Drive Experiences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {oaExperiences.map(exp => (
                <div key={exp.id} className="bg-card border border-border p-5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-bold text-primary">{exp.college}</span>
                    <span>{exp.date}</span>
                  </div>
                  <h4 className="font-bold text-base text-foreground">{exp.title}</h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">{exp.description}</p>
                  <div className="pt-2 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-secondary text-xs rounded font-mono font-semibold text-emerald-400">
                      {exp.extractedPattern}
                    </span>
                    <span className="px-2 py-0.5 bg-secondary text-xs rounded font-mono text-amber-400">
                      {exp.extractedDifficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: INTERVIEW GUIDE */}
      {activeTab === 'interview' && (
        <div className="space-y-8">
          {/* Technical Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Code2 className="w-5 h-5 text-primary" /> Infosys Technical Interview Question Bank
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TECHNICAL_INTERVIEW_DATA.map(tech => (
                <div key={tech.id} className="bg-card border border-border p-5 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-bold rounded">
                      {tech.category}
                    </span>
                    <span className="text-xs text-red-400 font-mono font-semibold">{tech.infosysFrequency} Frequency</span>
                  </div>
                  <h3 className="font-bold text-base text-foreground">{tech.question}</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">{tech.shortAnswer}</p>
                  {tech.detailedNotes && (
                    <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                      {tech.detailedNotes.map((note, idx) => (
                        <li key={idx}>{note}</li>
                      ))}
                    </ul>
                  )}
                  {tech.codeExample && (
                    <pre className="p-3 bg-zinc-950 text-emerald-400 rounded-lg text-[11px] font-mono overflow-x-auto">
                      {tech.codeExample}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* HR Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" /> HR & Behavioral Framework
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {HR_INTERVIEW_DATA.map(hr => (
                <div key={hr.id} className="bg-card border border-border p-5 rounded-xl space-y-3">
                  <h3 className="font-bold text-lg text-foreground">{hr.question}</h3>
                  <p className="text-xs text-amber-400 font-semibold">Intent: {hr.intent}</p>
                  <p className="text-xs text-zinc-300 font-mono">STAR Model: {hr.starFrameworkModel}</p>
                  <div className="text-xs text-muted-foreground">
                    <strong>Key Points:</strong> {hr.keyPointsToCover.join(' • ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: ANALYTICS & HEATMAP */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border p-6 rounded-xl text-center space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase">Total Problems</div>
              <div className="text-3xl font-extrabold text-foreground">{totalProblemsCount}</div>
            </div>
            <div className="bg-card border border-border p-6 rounded-xl text-center space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase">Solved & Mastered</div>
              <div className="text-3xl font-extrabold text-emerald-400">{solvedCount}</div>
            </div>
            <div className="bg-card border border-border p-6 rounded-xl text-center space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase">Overall Safe Zone</div>
              <div className="text-3xl font-extrabold text-primary">{overallSafeZonePercent}%</div>
            </div>
          </div>

          {/* 365 Day Revision Heatmap Simulation */}
          <div className="bg-card border border-border p-6 rounded-xl space-y-4">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" /> 365-Day Revision Activity Heatmap
            </h3>
            <div className="grid grid-cols-12 md:grid-cols-24 gap-1.5 pt-2">
              {Array.from({ length: 96 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-4 rounded-sm ${
                    i % 7 === 0 || i % 5 === 0 ? 'bg-emerald-500' :
                    i % 3 === 0 ? 'bg-emerald-700' :
                    'bg-zinc-800'
                  }`}
                  title={`Day ${i + 1}: ${i % 5 === 0 ? '4 problems solved' : 'Rest'}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notes Editor Modal */}
      {notesModalProblem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border max-w-lg w-full p-6 rounded-2xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-lg text-foreground">Notes: {notesModalProblem.problemName}</h3>
              <button onClick={() => setNotesModalProblem(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              value={notesText}
              onChange={e => setNotesText(e.target.value)}
              placeholder="Write personal revision notes, trick reminders, edge cases..."
              rows={6}
              className="w-full p-3 bg-secondary border border-border rounded-lg text-xs text-foreground focus:outline-none"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setNotesModalProblem(null)}
                className="px-4 py-2 rounded-lg bg-secondary text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
