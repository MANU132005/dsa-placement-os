'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy,
  Flame,
  Calendar,
  Clock,
  CheckCircle,
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
  MessageSquare
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
import { initialInfosysProblems, InfosysProblem, PLATFORM_BASE_URLS } from '@/lib/infosysData'

// Types for additional localStorage tracking
interface MockTest {
  id: string
  name: string
  questions: { name: string; difficulty: string; topic: string }[]
  score: number | null
  timeTaken: number | null // in minutes
  accuracy: number | null // percentage
  ranking: string | null
  mistakes: string
  solved: boolean
  attemptedAt?: string
}

interface MistakeLogEntry {
  id: string
  problemName: string
  mistakeType: string
  rootCause: string
  solution: string
  createdAt: string
}

interface LocalDashboardState {
  problems: InfosysProblem[]
  mocks: MockTest[]
  notes: string
  mistakeLogs: MistakeLogEntry[]
  currentStreak: number
  lastSolvedDate?: string
  missionStartDate?: string
  activeDay: number
}

// Initial mock tests data
const initialMocks: MockTest[] = [
  {
    id: 'mock-1',
    name: 'Infosys SP Mock 1 (Easy-Medium Basics)',
    questions: [
      { name: 'Two Sum', difficulty: 'Easy', topic: 'Arrays' },
      { name: 'Sort Colors', difficulty: 'Medium', topic: 'Arrays' },
      { name: 'Majority Element', difficulty: 'Easy', topic: 'Arrays' }
    ],
    score: null,
    timeTaken: null,
    accuracy: null,
    ranking: null,
    mistakes: '',
    solved: false
  },
  {
    id: 'mock-2',
    name: 'Infosys SP Mock 2 (Medium Patterns)',
    questions: [
      { name: 'Longest Consecutive Sequence', difficulty: 'Medium', topic: 'Arrays' },
      { name: 'Sliding Window Maximum', difficulty: 'Hard', topic: 'Sliding Window' },
      { name: 'Merge Intervals', difficulty: 'Medium', topic: 'Arrays' }
    ],
    score: null,
    timeTaken: null,
    accuracy: null,
    ranking: null,
    mistakes: '',
    solved: false
  },
  {
    id: 'mock-3',
    name: 'Infosys SP Mock 3 (Hard/SP-Level Challenge)',
    questions: [
      { name: 'Trapping Rain Water', difficulty: 'Hard', topic: 'Arrays' },
      { name: 'Number of Islands', difficulty: 'Medium', topic: 'Graphs' },
      { name: 'Validate Binary Search Tree', difficulty: 'Medium', topic: 'BST' }
    ],
    score: null,
    timeTaken: null,
    accuracy: null,
    ranking: null,
    mistakes: '',
    solved: false
  }
]

export default function MissionInfosysSPDashboard() {
  const { user } = useAuth()
  const uid = user?.id || 'guest'

  // Hydration guard
  const [mounted, setMounted] = useState(false)

  // Navigation state
  const [activeTab, setActiveTab] = useState<string>('overview')

  // Dashboard Master State
  const [state, setState] = useState<LocalDashboardState>({
    problems: initialInfosysProblems,
    mocks: initialMocks,
    notes: '',
    mistakeLogs: [],
    currentStreak: 0,
    activeDay: 1
  })

  // Timer states
  const [activeTimerProblemId, setActiveTimerProblemId] = useState<number | null>(null)
  const [timerSeconds, setTimerSeconds] = useState<number>(0)
  const [timerIsRunning, setTimerIsRunning] = useState<boolean>(false)
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Floating assistant states
  const [aiWidgetExpanded, setAiWidgetExpanded] = useState(false)
  const [aiMessageIndex, setAiMessageIndex] = useState(0)

  // Selected problem detail state for modals/forms
  const [selectedProblem, setSelectedProblem] = useState<InfosysProblem | null>(null)
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
  const [submitTimeTaken, setSubmitTimeTaken] = useState<number>(15)
  const [submitUsedHint, setSubmitUsedHint] = useState<string>('No')
  const [submitConfidence, setSubmitConfidence] = useState<number>(4)
  const [submitMistakeText, setSubmitMistakeText] = useState('')
  const [submitNotesText, setSubmitNotesText] = useState('')

  // Mock scoring form states
  const [activeMockFormId, setActiveMockFormId] = useState<string | null>(null)
  const [mockScore, setMockScore] = useState<number>(0)
  const [mockTime, setMockTime] = useState<number>(120)
  const [mockAccuracy, setMockAccuracy] = useState<number>(80)
  const [mockMistakes, setMockMistakes] = useState('')

  // Load state from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const localKey = `dsa_${uid}_infosys_sp_2027`
    const stored = localStorage.getItem(localKey)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Ensure date fields are correctly formatted
        setState(prev => ({
          ...prev,
          ...parsed,
          // Merge static initial data if fields are missing
          problems: parsed.problems || initialInfosysProblems,
          mocks: parsed.mocks || initialMocks,
          mistakeLogs: parsed.mistakeLogs || [],
          notes: parsed.notes || '',
          currentStreak: parsed.currentStreak || 0,
          activeDay: parsed.activeDay || 1
        }))
      } catch (e) {
        console.error('Error loading local state:', e)
      }
    } else {
      // First visit initialize start date
      const todayStr = new Date().toISOString()
      const initialState = {
        problems: initialInfosysProblems,
        mocks: initialMocks,
        notes: '',
        mistakeLogs: [],
        currentStreak: 0,
        missionStartDate: todayStr,
        activeDay: 1
      }
      setState(initialState)
      localStorage.setItem(localKey, JSON.stringify(initialState))
    }
  }, [uid])

  // Save state to localStorage whenever it changes
  const saveState = (updatedState: LocalDashboardState) => {
    setState(updatedState)
    const localKey = `dsa_${uid}_infosys_sp_2027`
    localStorage.setItem(localKey, JSON.stringify(updatedState))
  }

  // Timer interval handling
  useEffect(() => {
    if (timerIsRunning && activeTimerProblemId !== null) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1)
      }, 1000)
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [timerIsRunning, activeTimerProblemId])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-t-zinc-400 border-zinc-700 animate-spin" />
          <p className="text-sm text-zinc-400">Loading Mission Control...</p>
        </div>
      </div>
    )
  }

  // Timer Controls
  const handleStartTimer = (problemId: number) => {
    if (activeTimerProblemId !== null && activeTimerProblemId !== problemId) {
      // Prompt timer switch or stop previous
      handleStopTimer()
    }
    setActiveTimerProblemId(problemId)
    setTimerSeconds(0)
    setTimerIsRunning(true)
  }

  const handlePauseTimer = () => {
    setTimerIsRunning(false)
  }

  const handleResumeTimer = () => {
    setTimerIsRunning(true)
  }

  const handleStopTimer = () => {
    setTimerIsRunning(false)
    if (activeTimerProblemId !== null) {
      const prob = state.problems.find(p => p.id === activeTimerProblemId)
      if (prob) {
        setSelectedProblem(prob)
        setSubmitTimeTaken(Math.round(timerSeconds / 60) || 1)
        setSubmitUsedHint('No')
        setSubmitConfidence(4)
        setSubmitMistakeText('')
        setSubmitNotesText(prob.notes || '')
        setIsSubmitModalOpen(true)
      }
    }
  }

  const handleResetTimer = () => {
    setTimerSeconds(0)
  }

  // Submit Solve Progress Action (Adaptive Revision Engine Logic)
  const handleSubmitProgress = () => {
    if (!selectedProblem) return

    const timeTaken = submitTimeTaken
    const usedHint = submitUsedHint === 'Yes'
    const confidence = submitConfidence

    // Spaced repetition scheduling based on criteria
    let nextStatus: 'Not Started' | 'In Progress' | 'Solved' | 'Need Revision' | 'Mastered' = 'Solved'
    let nextIntervalDays = 1
    let failCountMultiplier = 0

    if (usedHint || timeTaken > 20) {
      // Red: High priority, revisit today/tomorrow
      nextStatus = 'Need Revision'
      nextIntervalDays = 1
      failCountMultiplier = 1
    } else if (timeTaken >= 10 && timeTaken <= 20) {
      // Yellow: Solved but slow, revisit tomorrow
      nextStatus = 'Solved'
      nextIntervalDays = 1
    } else {
      // Green: Quick solve, revisit in 3 days
      nextStatus = 'Mastered'
      nextIntervalDays = 3
    }

    const today = new Date()
    const nextDate = new Date()
    nextDate.setDate(today.getDate() + nextIntervalDays)

    // Update problem object
    const updatedProblems = state.problems.map(p => {
      if (p.id === selectedProblem.id) {
        return {
          ...p,
          status: nextStatus,
          confidence: confidence,
          expectedTime: p.expectedTime,
          solveTime: timeTaken,
          lastAttempted: today.toISOString(),
          nextRevisionDate: nextDate.toISOString(),
          notes: submitNotesText || p.notes,
          mistakes: submitMistakeText || p.mistakes
        }
      }
      return p
    })

    // Update mistake log if provided
    let updatedMistakeLogs = [...state.mistakeLogs]
    if (submitMistakeText) {
      updatedMistakeLogs.unshift({
        id: Math.random().toString(36).substring(7),
        problemName: selectedProblem.problemName,
        mistakeType: 'Conceptual/Implementation',
        rootCause: submitMistakeText,
        solution: 'Review pattern rules and alternative code implementations.',
        createdAt: today.toISOString()
      })
    }

    // Streak logic update
    let nextStreak = state.currentStreak
    const lastSolvedStr = state.lastSolvedDate ? state.lastSolvedDate.split('T')[0] : null
    const todayStr = today.toISOString().split('T')[0]

    if (lastSolvedStr !== todayStr) {
      const yesterday = new Date()
      yesterday.setDate(today.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]
      if (lastSolvedStr === yesterdayStr || lastSolvedStr === null) {
        nextStreak += 1
      } else {
        nextStreak = 1
      }
    }

    const nextState = {
      ...state,
      problems: updatedProblems,
      mistakeLogs: updatedMistakeLogs,
      currentStreak: nextStreak,
      lastSolvedDate: today.toISOString()
    }

    saveState(nextState)
    setIsSubmitModalOpen(false)
    setSelectedProblem(null)
    setActiveTimerProblemId(null)
    setTimerSeconds(0)
    setTimerIsRunning(false)
  }

  // Toggle Bookmark
  const handleToggleBookmark = (id: number, key: 'bookmarked' | 'favorite') => {
    const updated = state.problems.map(p => {
      if (p.id === id) {
        return { ...p, [key]: !p[key] }
      }
      return p
    })
    saveState({ ...state, problems: updated })
  }

  // Mock Submit Action
  const handleSubmitMock = (mockId: string) => {
    const updatedMocks = state.mocks.map(m => {
      if (m.id === mockId) {
        return {
          ...m,
          solved: true,
          score: mockScore,
          timeTaken: mockTime,
          accuracy: mockAccuracy,
          mistakes: mockMistakes,
          attemptedAt: new Date().toISOString()
        }
      }
      return m
    })
    saveState({ ...state, mocks: updatedMocks })
    setActiveMockFormId(null)
    setMockScore(0)
    setMockTime(120)
    setMockAccuracy(80)
    setMockMistakes('')
  }

  // Quick stat variables
  const totalRevisions = state.problems.filter(p => !p.isGap).length
  const totalGaps = state.problems.filter(p => p.isGap).length
  const solvedRevisions = state.problems.filter(p => !p.isGap && (p.status === 'Solved' || p.status === 'Mastered')).length
  const solvedGaps = state.problems.filter(p => p.isGap && (p.status === 'Solved' || p.status === 'Mastered')).length
  const totalProblemsCount = state.problems.length
  const totalSolvedCount = state.problems.filter(p => p.status === 'Solved' || p.status === 'Mastered').length

  const overallProgressPercent = Math.round((totalSolvedCount / totalProblemsCount) * 100) || 0
  const revisionProgressPercent = Math.round((solvedRevisions / totalRevisions) * 100) || 0
  const gapProgressPercent = Math.round((solvedGaps / totalGaps) * 100) || 0

  // Calculate readiness metrics
  const getReadinessScore = (type: 'overall' | 'sp' | 'dse') => {
    const revisionsSolved = state.problems.filter(p => !p.isGap && (p.status === 'Solved' || p.status === 'Mastered'))
    const gapsSolved = state.problems.filter(p => p.isGap && (p.status === 'Solved' || p.status === 'Mastered'))

    // Average confidence metric
    const confList = state.problems.filter(p => p.confidence > 0).map(p => p.confidence)
    const avgConfidence = confList.length > 0 ? confList.reduce((a, b) => a + b, 0) / confList.length : 0

    // Mock scores average
    const attemptedMocks = state.mocks.filter(m => m.solved && m.score !== null)
    const avgMockScore = attemptedMocks.length > 0 ? (attemptedMocks.reduce((a, b) => a + (b.score || 0), 0) / attemptedMocks.length) : 0

    if (type === 'overall') {
      // Weighted index: 40% revision, 30% gap, 15% confidence, 15% mocks
      const revFactor = (revisionsSolved.length / 45) * 40
      const gapFactor = (gapsSolved.length / 15) * 30
      const confFactor = (avgConfidence / 5) * 15
      const mockFactor = (avgMockScore / 100) * 15
      return Math.round(revFactor + gapFactor + confFactor + mockFactor) || 0
    } else if (type === 'dse') {
      // DSE is simpler: mostly focus on basic/medium revisions + basic array/string/search topics
      const dseRevisions = revisionsSolved.filter(p => p.difficulty !== 'Hard').length
      return Math.round((dseRevisions / 38) * 80 + (avgConfidence / 5) * 20) || 0
    } else {
      // SP focuses heavily on Hard revisions, DP, Graph, BST gaps, and mock test scores
      const spGaps = gapsSolved.length
      const spHard = revisionsSolved.filter(p => p.difficulty === 'Hard').length
      const gapFactor = (spGaps / 15) * 40
      const hardFactor = (spHard / 7) * 30
      const mockFactor = (avgMockScore / 100) * 20
      const confFactor = (avgConfidence / 5) * 10
      return Math.round(gapFactor + hardFactor + mockFactor + confFactor) || 0
    }
  }

  const overallReadiness = getReadinessScore('overall')
  const dseReadiness = getReadinessScore('dse')
  const spReadiness = getReadinessScore('sp')

  // Calculate day completion stats
  const getDayProgress = (dayNum: number) => {
    const dayProbs = state.problems.filter(p => p.day === dayNum)
    const solved = dayProbs.filter(p => p.status === 'Solved' || p.status === 'Mastered').length
    return Math.round((solved / dayProbs.length) * 100) || 0
  }

  // Weak/Strong Areas calculations
  const getTopicStats = () => {
    const topicsMap: { [key: string]: { total: number; solved: number; times: number[]; confidences: number[] } } = {}
    
    state.problems.forEach(p => {
      if (!topicsMap[p.topic]) {
        topicsMap[p.topic] = { total: 0, solved: 0, times: [], confidences: [] }
      }
      topicsMap[p.topic].total += 1
      if (p.status === 'Solved' || p.status === 'Mastered') {
        topicsMap[p.topic].solved += 1
      }
      if (p.solveTime) {
        topicsMap[p.topic].times.push(p.solveTime)
      }
      if (p.confidence > 0) {
        topicsMap[p.topic].confidences.push(p.confidence)
      }
    })

    return Object.keys(topicsMap).map(topic => {
      const info = topicsMap[topic]
      const avgTime = info.times.length > 0 ? Math.round(info.times.reduce((a,b) => a+b, 0) / info.times.length) : 0
      const avgConf = info.confidences.length > 0 ? parseFloat((info.confidences.reduce((a,b) => a+b, 0) / info.confidences.length).toFixed(1)) : 0
      const completion = Math.round((info.solved / info.total) * 100)
      
      let status: 'Green' | 'Yellow' | 'Red' = 'Red'
      if (completion >= 80 && avgConf >= 4.0) status = 'Green'
      else if (completion >= 50 || avgConf >= 3.0) status = 'Yellow'

      return {
        topic,
        total: info.total,
        solved: info.solved,
        completion,
        avgTime,
        avgConf,
        status
      }
    })
  }

  const topicStats = getTopicStats()
  const weakAreas = topicStats.filter(t => t.status === 'Red' || t.avgConf < 3.0).slice(0, 3)
  const strongAreas = topicStats.filter(t => t.status === 'Green' && t.avgConf >= 4.0).slice(0, 3)

  // Floating Assistant Messages Config
  const assistantMessages = [
    `Welcome! Day ${state.activeDay} of your Infosys SP 2027 preparation is active. Let's solve remaining challenges.`,
    `Suggested Next: Try "${
      state.problems.find(p => p.day === state.activeDay && p.status !== 'Solved' && p.status !== 'Mastered')?.problemName || 'any Gap-Filling problem'
    }" to maintain your active momentum!`,
    `Focus on Graph and Dynamic Programming gaps today. These represent 60% of L2/L3 coding items in SP exams!`,
    `Keep your revision streak alive! Currently at ${state.currentStreak} day${state.currentStreak === 1 ? '' : 's'}.`
  ]

  const handleNextMessage = () => {
    setAiMessageIndex((prev) => (prev + 1) % assistantMessages.length)
  }

  // Countdown calculations (5 Days Countdown)
  const getCountdownString = () => {
    if (!state.missionStartDate) return '0d 00h 00m'
    const start = new Date(state.missionStartDate)
    const end = new Date(start.getTime() + 5 * 24 * 60 * 60 * 1000)
    const diff = end.getTime() - new Date().getTime()
    if (diff <= 0) return '0d 00h 00m'

    const days = Math.floor(diff / (24 * 60 * 60 * 1000))
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
    const mins = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000))
    return `${days}d ${hours}h ${mins}m`
  }

  // Build platform URLs dynamically based on prefix map
  const getPlatformUrl = (platform: keyof typeof PLATFORM_BASE_URLS, slug: string) => {
    if (!slug) return '#'
    const base = PLATFORM_BASE_URLS[platform]
    return `${base}${slug}`
  }

  return (
    <div className="space-y-8 bg-zinc-950 text-zinc-100 rounded-2xl border border-zinc-900/60 p-6 shadow-2xl relative overflow-hidden transition-colors duration-200">
      {/* Glow highlight effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-2xl flex items-center justify-center text-blue-400">
            <Trophy className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-white">Mission Infosys SP 2027</h1>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-mono font-medium">
                CAMPUS DRIVE
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">Specialist Programmer Preparation Command Center</p>
          </div>
        </div>

        {/* Global Action Stats / Countdown */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800/80 rounded-xl px-4 py-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <div className="text-left">
              <p className="text-[9px] text-zinc-500 font-mono">COUNTDOWN</p>
              <p className="text-xs font-bold text-zinc-200 font-mono">{getCountdownString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800/80 rounded-xl px-4 py-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <div className="text-left">
              <p className="text-[9px] text-zinc-500 font-mono">SOLVE STREAK</p>
              <p className="text-xs font-bold text-zinc-200 font-mono">{state.currentStreak} Days</p>
            </div>
          </div>
        </div>
      </header>

      {/* METRICS & OVERALL READY GRID */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative z-10">
        {/* Readiness index card */}
        <div className="bg-zinc-900/40 border border-zinc-850 backdrop-blur-md rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Target SP Readiness</span>
            <Target className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight font-mono text-white">{overallReadiness}%</span>
            <span className="text-xs text-emerald-400">+{overallProgressPercent}% progress</span>
          </div>
          <div className="w-full bg-zinc-800/80 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${overallReadiness}%` }} />
          </div>
        </div>

        {/* SP Level Metrics */}
        <div className="bg-zinc-900/40 border border-zinc-850 backdrop-blur-md rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Specialist Programmer (SP) L1/L2</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight font-mono text-white">{spReadiness}%</span>
            <span className="text-xs text-zinc-500">L3 Advanced</span>
          </div>
          <div className="w-full bg-zinc-800/80 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-1000" style={{ width: `${spReadiness}%` }} />
          </div>
        </div>

        {/* DSE Level Metrics */}
        <div className="bg-zinc-900/40 border border-zinc-850 backdrop-blur-md rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Digital Specialist Engineer (DSE)</span>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight font-mono text-white">{dseReadiness}%</span>
            <span className="text-xs text-zinc-500">Fast-track target</span>
          </div>
          <div className="w-full bg-zinc-800/80 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-1000" style={{ width: `${dseReadiness}%` }} />
          </div>
        </div>

        {/* Overall solved counters */}
        <div className="bg-zinc-900/40 border border-zinc-850 backdrop-blur-md rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Revisions & Gaps Solved</span>
            <CheckCircle className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight font-mono text-white">{totalSolvedCount}/{totalProblemsCount}</span>
            <span className="text-xs text-zinc-400">({overallProgressPercent}%)</span>
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
            <span>Revs: {solvedRevisions}/45</span>
            <span>Gaps: {solvedGaps}/15</span>
          </div>
        </div>
      </section>

      {/* CORE NAV TABS CONTROL */}
      <nav className="flex items-center gap-1.5 border-b border-zinc-900 pb-2 overflow-x-auto relative z-10 scrollbar-none">
        {[
          { id: 'overview', label: 'Overview', icon: Target },
          { id: '5day', label: '5-Day Plan', icon: Calendar },
          { id: 'matrix', label: 'Revision Matrix', icon: Brain },
          { id: 'gap', label: 'Gap Filling', icon: Lightbulb },
          { id: 'mocks', label: 'Mock Tests', icon: Award },
          { id: 'notes', label: 'Prep Journal', icon: FileText },
          { id: 'mistakes', label: 'Mistake Tracker', icon: AlertTriangle },
          { id: 'stats', label: 'Statistics', icon: BarChart2 },
          { id: 'resources', label: 'Resources', icon: BookOpen }
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border ${
                isActive
                  ? 'bg-zinc-900 text-white border-zinc-800 shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/30 border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>

      {/* ACTIVE TAB DISPLAY VIEWPORT */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
          >
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Timeline progress mapping */}
                  <div className="lg:col-span-2 bg-zinc-900/30 border border-zinc-900 rounded-2xl p-6 space-y-5">
                    <h2 className="text-sm font-bold tracking-wider text-zinc-400 uppercase">Preparation Timeline</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Yesterday progress summary */}
                      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 space-y-2">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase font-mono">Yesterday's Progress</p>
                        <p className="text-xs text-zinc-300 font-medium">Completed Day {state.activeDay > 1 ? state.activeDay - 1 : 1} targets. Solved revisions and review logs.</p>
                      </div>

                      {/* Today's Target plan */}
                      <div className="bg-zinc-950 border border-blue-900/40 rounded-xl p-4 space-y-2 shadow-[0_0_12px_rgba(59,130,246,0.05)]">
                        <p className="text-[10px] text-blue-400 font-bold uppercase font-mono">Today's Mission (Day {state.activeDay})</p>
                        <p className="text-xs text-zinc-200 font-semibold">
                          {state.problems.filter(p => p.day === state.activeDay && p.status !== 'Solved' && p.status !== 'Mastered').length} problems remaining
                        </p>
                        <button 
                          onClick={() => setActiveTab('5day')}
                          className="text-[10px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 group mt-2"
                        >
                          <span>Execute now</span>
                          <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>

                      {/* Tomorrow's forecast */}
                      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 space-y-2">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase font-mono">Tomorrow's Forecast</p>
                        <p className="text-xs text-zinc-300 font-medium">Day {state.activeDay < 5 ? state.activeDay + 1 : 5} graph-theoretic algorithms and dynamic tables.</p>
                      </div>
                    </div>

                    {/* Quick performance insights graph */}
                    <div className="pt-4 border-t border-zinc-900/60">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-bold text-zinc-400">Daily Solves Heat</h3>
                        <span className="text-[10px] text-zinc-500">Live feed updates</span>
                      </div>
                      <div className="h-44 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={[
                              { day: 'Day 1', solved: getDayProgress(1) },
                              { day: 'Day 2', solved: getDayProgress(2) },
                              { day: 'Day 3', solved: getDayProgress(3) },
                              { day: 'Day 4', solved: getDayProgress(4) },
                              { day: 'Day 5', solved: getDayProgress(5) }
                            ]}
                            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="solveGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="day" stroke="#52525b" fontSize={9} />
                            <YAxis stroke="#52525b" fontSize={9} />
                            <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5', fontSize: 11 }} />
                            <Area type="monotone" dataKey="solved" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#solveGrad)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Weak / Strong topics summary panel */}
                  <div className="space-y-6">
                    {/* Critical review queue (problems with Red status or High revision priority) */}
                    <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center gap-2 text-rose-500">
                        <AlertTriangle className="w-4 h-4" />
                        <h2 className="text-sm font-bold tracking-wider text-zinc-400 uppercase">Critical Revision Queue</h2>
                      </div>
                      <div className="space-y-2">
                        {state.problems.filter(p => p.status === 'Need Revision').length === 0 ? (
                          <div className="text-center py-4 bg-zinc-950/60 rounded-xl border border-dashed border-zinc-900">
                            <p className="text-xs text-zinc-500">Queue empty. No high priority revisions!</p>
                          </div>
                        ) : (
                          state.problems.filter(p => p.status === 'Need Revision').map(p => (
                            <div 
                              key={p.id} 
                              onClick={() => {
                                setSelectedProblem(p)
                                setSubmitNotesText(p.notes || '')
                                setSubmitMistakeText(p.mistakes || '')
                                setIsSubmitModalOpen(true)
                              }}
                              className="flex items-center justify-between p-3 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/20 rounded-xl cursor-pointer transition-all"
                            >
                              <div className="truncate pr-4">
                                <p className="text-xs font-bold text-zinc-200 truncate">{p.problemName}</p>
                                <p className="text-[9px] text-rose-400 font-semibold uppercase tracking-wider mt-0.5">{p.topic}</p>
                              </div>
                              <Play className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Weak vs Strong focus indicator */}
                    <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-6 space-y-4">
                      <h2 className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Topic Diagnostics</h2>
                      <div className="space-y-3">
                        <div>
                          <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider mb-2">Weak Areas</p>
                          <div className="space-y-1.5">
                            {weakAreas.length === 0 ? (
                              <p className="text-xs text-zinc-500">No critical weak areas detected.</p>
                            ) : (
                              weakAreas.map(w => (
                                <div key={w.topic} className="flex justify-between text-xs text-zinc-300">
                                  <span>{w.topic}</span>
                                  <span className="font-mono text-rose-500 font-semibold">{w.completion}% Mastery</span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-zinc-900">
                          <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider mb-2">Strongest Topics</p>
                          <div className="space-y-1.5">
                            {strongAreas.length === 0 ? (
                              <p className="text-xs text-zinc-500 font-medium">Keep solving problems to detect strengths.</p>
                            ) : (
                              strongAreas.map(s => (
                                <div key={s.topic} className="flex justify-between text-xs text-zinc-300">
                                  <span>{s.topic}</span>
                                  <span className="font-mono text-emerald-500 font-semibold">{s.completion}% Mastery</span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5-DAY PLAN TAB */}
            {activeTab === '5day' && (
              <div className="space-y-6">
                {/* Days selectors header */}
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((dayNum) => {
                    const isActiveDay = state.activeDay === dayNum
                    const progress = getDayProgress(dayNum)
                    return (
                      <button
                        key={dayNum}
                        onClick={() => saveState({ ...state, activeDay: dayNum })}
                        className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${
                          isActiveDay
                            ? 'bg-blue-600/10 border-blue-500/60 shadow-[0_0_12px_rgba(59,130,246,0.1)]'
                            : 'bg-zinc-900/30 border-zinc-900 hover:border-zinc-800'
                        }`}
                      >
                        <span className="text-[10px] text-zinc-500 font-bold uppercase font-mono">Day</span>
                        <span className="text-lg font-black font-mono mt-0.5 text-white">{dayNum}</span>
                        <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${progress}%` }} 
                          />
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Day specifics summary cards */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900/20 border border-zinc-900 rounded-2xl p-4">
                  <div className="flex items-center gap-4">
                    <p className="text-sm font-semibold text-zinc-300">
                      Day {state.activeDay} Target Sheet
                    </p>
                    <span className="text-xs bg-zinc-900 text-zinc-400 border border-zinc-800 px-3 py-1 rounded-xl font-medium">
                      {getDayProgress(state.activeDay)}% Completed
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const allDayProbs = state.problems.filter(p => p.day === state.activeDay)
                        const completed = allDayProbs.map(p => ({ ...p, status: 'Solved' as const }))
                        const updated = state.problems.map(p => {
                          const c = completed.find(item => item.id === p.id)
                          return c ? c : p
                        })
                        saveState({ ...state, problems: updated })
                      }}
                      className="text-[10px] font-bold border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 px-3.5 py-1.5 rounded-xl transition-all"
                    >
                      Mark All Completed
                    </button>
                  </div>
                </div>

                {/* Problems list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {state.problems
                    .filter(p => p.day === state.activeDay)
                    .map(prob => {
                      const isTimerActive = activeTimerProblemId === prob.id
                      return (
                        <div
                          key={prob.id}
                          className={`bg-zinc-900/30 border rounded-2xl p-5 space-y-4 hover:border-zinc-800 transition-all flex flex-col justify-between ${
                            prob.status === 'Solved' || prob.status === 'Mastered'
                              ? 'border-emerald-500/20 hover:border-emerald-500/40 bg-emerald-500/[0.01]'
                              : prob.status === 'Need Revision'
                              ? 'border-rose-500/20 hover:border-rose-500/40 bg-rose-500/[0.01]'
                              : 'border-zinc-900'
                          }`}
                        >
                          <div>
                            {/* Problem Title & Meta Info */}
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                  prob.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                                  prob.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                                }`}>
                                  {prob.difficulty}
                                </span>
                                <h3 className="text-sm font-bold text-zinc-100 mt-2">{prob.problemName}</h3>
                                <p className="text-[10px] text-zinc-500 font-medium font-mono tracking-wide mt-1">
                                  {prob.topic} &bull; {prob.pattern}
                                </p>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleToggleBookmark(prob.id, 'bookmarked')}
                                  className={`p-1.5 rounded-lg border border-transparent transition-all ${
                                    prob.bookmarked ? 'text-amber-500 bg-amber-500/10' : 'text-zinc-500 hover:text-zinc-300'
                                  }`}
                                >
                                  <Bookmark className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* ROI and Probability indicators */}
                            <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-zinc-900/60">
                              <div>
                                <p className="text-[9px] text-zinc-500 font-bold uppercase font-mono">ROI Score</p>
                                <p className="text-xs font-bold text-zinc-200 font-mono mt-0.5">{prob.roiScore}/100</p>
                              </div>
                              <div>
                                <p className="text-[9px] text-zinc-500 font-bold uppercase font-mono">Infosys Prob.</p>
                                <p className="text-xs font-bold text-blue-400 font-mono mt-0.5">{prob.probabilityScore}%</p>
                              </div>
                            </div>

                            {/* Time trackers & expected */}
                            <div className="grid grid-cols-2 gap-3 mt-3">
                              <div>
                                <p className="text-[9px] text-zinc-500 font-bold uppercase font-mono">Target Time</p>
                                <p className="text-xs font-bold text-zinc-400 font-mono mt-0.5">{prob.expectedTime} min</p>
                              </div>
                              <div>
                                <p className="text-[9px] text-zinc-500 font-bold uppercase font-mono">Status</p>
                                <span className={`text-[10px] font-bold mt-1 inline-block ${
                                  prob.status === 'Mastered' ? 'text-emerald-400' :
                                  prob.status === 'Solved' ? 'text-blue-400' :
                                  prob.status === 'Need Revision' ? 'text-rose-400' : 'text-zinc-500'
                                }`}>
                                  {prob.status}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action Items Footer */}
                          <div className="mt-5 space-y-3 pt-3 border-t border-zinc-900/60">
                            {/* Platform link builder */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              {prob.leetcode && (
                                <a 
                                  href={getPlatformUrl('leetcode', prob.leetcode)} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[9px] font-semibold border border-zinc-800 hover:border-zinc-700 bg-zinc-950 px-2 py-1 rounded hover:text-white transition-all"
                                >
                                  LeetCode
                                </a>
                              )}
                              {prob.gfg && (
                                <a 
                                  href={getPlatformUrl('gfg', prob.gfg)} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[9px] font-semibold border border-zinc-800 hover:border-zinc-700 bg-zinc-950 px-2 py-1 rounded hover:text-white transition-all"
                                >
                                  GFG
                                </a>
                              )}
                              {prob.codingNinjas && (
                                <a 
                                  href={getPlatformUrl('codingNinjas', prob.codingNinjas)} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[9px] font-semibold border border-zinc-800 hover:border-zinc-700 bg-zinc-950 px-2 py-1 rounded hover:text-white transition-all"
                                >
                                  Ninjas
                                </a>
                              )}
                              {prob.takeUForward && (
                                <a 
                                  href={prob.takeUForward} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[9px] font-semibold border border-zinc-800 hover:border-zinc-700 bg-zinc-950 px-2 py-1 rounded hover:text-white transition-all flex items-center gap-1"
                                >
                                  <span>TUF</span>
                                  <Video className="w-2.5 h-2.5 text-rose-500" />
                                </a>
                              )}
                            </div>

                            {/* Revision inline timer */}
                            <div className="flex items-center justify-between gap-2 bg-zinc-950 border border-zinc-900 rounded-xl p-2">
                              {isTimerActive ? (
                                <>
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                                    <span className="font-mono text-xs font-bold text-zinc-200">
                                      {Math.floor(timerSeconds / 60)}m {timerSeconds % 60}s
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {timerIsRunning ? (
                                      <button onClick={handlePauseTimer} className="p-1 hover:bg-zinc-800 rounded text-amber-500">
                                        <Pause className="w-3.5 h-3.5" />
                                      </button>
                                    ) : (
                                      <button onClick={handleResumeTimer} className="p-1 hover:bg-zinc-800 rounded text-emerald-500">
                                        <Play className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                    <button onClick={handleStopTimer} className="text-[10px] font-bold bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded text-white transition-all">
                                      Submit
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <span className="text-[10px] text-zinc-500 font-bold uppercase font-mono">Timer Session</span>
                                  <button
                                    onClick={() => handleStartTimer(prob.id)}
                                    className="text-[10px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-all"
                                  >
                                    <Play className="w-3 h-3" />
                                    <span>Start timer</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}

            {/* REVISION MATRIX TAB */}
            {activeTab === 'matrix' && (
              <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-6 space-y-6">
                <div>
                  <h2 className="text-sm font-bold tracking-wider text-zinc-400 uppercase">Interactive Revision Matrix</h2>
                  <p className="text-xs text-zinc-500 mt-1">Real-time stats aggregated by core problem concepts.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topicStats.map(topic => (
                    <div key={topic.topic} className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold text-zinc-200">{topic.topic}</h3>
                          <div className={`w-2 h-2 rounded-full ${
                            topic.status === 'Green' ? 'bg-emerald-500' :
                            topic.status === 'Yellow' ? 'bg-amber-500' : 'bg-rose-500'
                          }`} />
                        </div>
                        
                        {/* Progress slider bar */}
                        <div className="mt-3 space-y-1">
                          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                            <span>Solved {topic.solved}/{topic.total}</span>
                            <span>{topic.completion}%</span>
                          </div>
                          <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                            <div 
                              className="bg-blue-500 h-full rounded-full transition-all duration-700" 
                              style={{ width: `${topic.completion}%` }} 
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-900/80 text-[10px] font-mono text-zinc-500">
                        <div>
                          <p>Avg Solve</p>
                          <p className="font-bold text-zinc-300 mt-0.5">{topic.avgTime > 0 ? `${topic.avgTime} mins` : 'N/A'}</p>
                        </div>
                        <div>
                          <p>Confidence</p>
                          <div className="flex items-center gap-0.5 text-zinc-300 mt-0.5 font-bold">
                            <span>{topic.avgConf || 'N/A'}</span>
                            <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GAP FILLING TAB */}
            {activeTab === 'gap' && (
              <div className="space-y-6">
                <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-6 space-y-2">
                  <h2 className="text-sm font-bold tracking-wider text-zinc-400 uppercase">Gap-Filling Modules</h2>
                  <p className="text-xs text-zinc-500">
                    Specifically target Heap, BST, Graph, and DP Basics. Solve these to increase your SP Readiness to L3.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {state.problems
                    .filter(p => p.isGap)
                    .map(prob => (
                      <div
                        key={prob.id}
                        className={`bg-zinc-900/30 border rounded-2xl p-5 space-y-4 hover:border-zinc-800 transition-all flex flex-col justify-between ${
                          prob.status === 'Solved' || prob.status === 'Mastered'
                            ? 'border-emerald-500/20 bg-emerald-500/[0.01]'
                            : 'border-zinc-900'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                GAP PROBLEM
                              </span>
                              <h3 className="text-sm font-bold text-zinc-100 mt-2">{prob.problemName}</h3>
                              <p className="text-[10px] text-zinc-500 font-medium font-mono tracking-wide mt-1">
                                {prob.topic} &bull; {prob.pattern}
                              </p>
                            </div>
                            <button
                              onClick={() => handleToggleBookmark(prob.id, 'bookmarked')}
                              className={`p-1.5 rounded-lg border border-transparent transition-all ${
                                prob.bookmarked ? 'text-amber-500 bg-amber-500/10' : 'text-zinc-500 hover:text-zinc-300'
                              }`}
                            >
                              <Bookmark className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-zinc-900/60">
                            <div>
                              <p className="text-[9px] text-zinc-500 font-bold uppercase font-mono">ROI Score</p>
                              <p className="text-xs font-bold text-zinc-200 font-mono mt-0.5">{prob.roiScore}/100</p>
                            </div>
                            <div>
                              <p className="text-[9px] text-zinc-500 font-bold uppercase font-mono">SP Prob.</p>
                              <p className="text-xs font-bold text-blue-400 font-mono mt-0.5">{prob.probabilityScore}%</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 space-y-3 pt-3 border-t border-zinc-900/60">
                          {/* Platform Links */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            {prob.leetcode && (
                              <a href={getPlatformUrl('leetcode', prob.leetcode)} target="_blank" rel="noopener noreferrer" className="text-[9px] font-semibold border border-zinc-800 bg-zinc-950 px-2 py-1 rounded hover:text-white transition-all">LeetCode</a>
                            )}
                            {prob.gfg && (
                              <a href={getPlatformUrl('gfg', prob.gfg)} target="_blank" rel="noopener noreferrer" className="text-[9px] font-semibold border border-zinc-800 bg-zinc-950 px-2 py-1 rounded hover:text-white transition-all">GFG</a>
                            )}
                            {prob.codingNinjas && (
                              <a href={getPlatformUrl('codingNinjas', prob.codingNinjas)} target="_blank" rel="noopener noreferrer" className="text-[9px] font-semibold border border-zinc-800 bg-zinc-950 px-2 py-1 rounded hover:text-white transition-all">Ninjas</a>
                            )}
                            {prob.takeUForward && (
                              <a href={prob.takeUForward} target="_blank" rel="noopener noreferrer" className="text-[9px] font-semibold border border-zinc-800 bg-zinc-950 px-2 py-1 rounded hover:text-white transition-all">TUF</a>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-mono ${
                              prob.status === 'Solved' || prob.status === 'Mastered' ? 'text-emerald-400' : 'text-zinc-500'
                            }`}>
                              Status: {prob.status}
                            </span>
                            <button
                              onClick={() => {
                                setSelectedProblem(prob)
                                setSubmitTimeTaken(prob.solveTime || 20)
                                setSubmitConfidence(prob.confidence || 4)
                                setSubmitNotesText(prob.notes || '')
                                setSubmitMistakeText(prob.mistakes || '')
                                setIsSubmitModalOpen(true)
                              }}
                              className="text-[10px] font-bold bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-xl transition-all"
                            >
                              Log Attempt
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* MOCK TESTS TAB */}
            {activeTab === 'mocks' && (
              <div className="space-y-6">
                <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-6 space-y-2">
                  <h2 className="text-sm font-bold tracking-wider text-zinc-400 uppercase">Infosys SP Standard Mock Exams</h2>
                  <p className="text-xs text-zinc-500">
                    Each mock test has 3 structured SP questions, timed for 180 minutes. Solve offline and log performance results.
                  </p>
                </div>

                <div className="space-y-4">
                  {state.mocks.map((mock) => (
                    <div key={mock.id} className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-sm font-bold text-zinc-200">{mock.name}</h3>
                          <div className="flex items-center gap-3 mt-1 text-[10px] font-mono text-zinc-500">
                            <span>3 Questions</span>
                            <span>&bull;</span>
                            <span>180 mins limit</span>
                          </div>
                        </div>

                        {mock.solved ? (
                          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                            <div className="text-right">
                              <span className="text-[10px] text-zinc-500 uppercase">SCORE</span>
                              <p className="font-bold text-emerald-400">{mock.score}/100</p>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-zinc-500 uppercase">ACCURACY</span>
                              <p className="font-bold text-blue-400">{mock.accuracy}%</p>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-zinc-500 uppercase">TIME</span>
                              <p className="font-bold text-zinc-300">{mock.timeTaken} mins</p>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setActiveMockFormId(mock.id)}
                            className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl transition-all"
                          >
                            Enter Scores
                          </button>
                        )}
                      </div>

                      {/* Launch Mock Form */}
                      {activeMockFormId === mock.id && (
                        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[10px] text-zinc-500 uppercase font-mono mb-1">Score (0-100)</label>
                              <input 
                                type="number" 
                                value={mockScore} 
                                onChange={e => setMockScore(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm text-zinc-200 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-zinc-500 uppercase font-mono mb-1">Time taken (mins)</label>
                              <input 
                                type="number" 
                                value={mockTime} 
                                onChange={e => setMockTime(parseInt(e.target.value) || 0)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm text-zinc-200 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-zinc-500 uppercase font-mono mb-1">Accuracy (%)</label>
                              <input 
                                type="number" 
                                value={mockAccuracy} 
                                onChange={e => setMockAccuracy(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm text-zinc-200 focus:outline-none"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] text-zinc-500 uppercase font-mono mb-1">Mistakes / Review Notes</label>
                            <textarea 
                              value={mockMistakes} 
                              onChange={e => setMockMistakes(e.target.value)}
                              placeholder="Describe any edge cases missed or complex patterns that caused delays..."
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none h-16 resize-none"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setActiveMockFormId(null)} className="text-[10px] font-bold border border-zinc-850 hover:bg-zinc-900 px-3 py-1.5 rounded-xl">Cancel</button>
                            <button onClick={() => handleSubmitMock(mock.id)} className="text-[10px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-xl">Save Results</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PREP JOURNAL TAB */}
            {activeTab === 'notes' && (
              <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-6 space-y-4">
                <div>
                  <h2 className="text-sm font-bold tracking-wider text-zinc-400 uppercase">Preparation Journal & Strategies</h2>
                  <p className="text-xs text-zinc-500 mt-1">Persist global notes, tricks, complexity cheat sheets, or interview guidelines.</p>
                </div>

                <textarea
                  value={state.notes}
                  onChange={(e) => saveState({ ...state, notes: e.target.value })}
                  placeholder="Record optimal templates, edge cases for sliding windows, tree Traversals configurations, or dynamic matrix layouts..."
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl p-4 text-xs font-mono text-zinc-300 focus:outline-none min-h-[40vh] resize-y"
                />
              </div>
            )}

            {/* MISTAKE TRACKER TAB */}
            {activeTab === 'mistakes' && (
              <div className="space-y-6">
                <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-6 space-y-2">
                  <h2 className="text-sm font-bold tracking-wider text-zinc-400 uppercase">Mistake Journal Log</h2>
                  <p className="text-xs text-zinc-500">
                    A historical record of conceptual traps, off-by-one errors, and syntax traps registered during solves.
                  </p>
                </div>

                <div className="space-y-4">
                  {state.mistakeLogs.length === 0 ? (
                    <div className="text-center py-10 bg-zinc-900/20 border border-dashed border-zinc-900 rounded-2xl">
                      <p className="text-xs text-zinc-500">No mistakes logged yet! Solve problems and note complexities to populate this index.</p>
                    </div>
                  ) : (
                    state.mistakeLogs.map(log => (
                      <div key={log.id} className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-5 space-y-3 relative">
                        <button
                          onClick={() => {
                            const updated = state.mistakeLogs.filter(item => item.id !== log.id)
                            saveState({ ...state, mistakeLogs: updated })
                          }}
                          className="absolute top-4 right-4 p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-rose-500 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div>
                          <span className="text-[9px] text-zinc-500 font-mono font-bold uppercase">{new Date(log.createdAt).toLocaleDateString()}</span>
                          <h3 className="text-xs font-bold text-zinc-200 mt-1">{log.problemName}</h3>
                          <p className="text-[10px] text-amber-500 font-mono mt-0.5">Trap: {log.mistakeType}</p>
                        </div>
                        <div className="bg-zinc-950 border border-zinc-900/60 rounded-xl p-3 text-xs text-zinc-300 leading-relaxed font-mono">
                          <span className="text-[9px] text-zinc-500 font-bold block mb-1">ROOT CAUSE / NOTES:</span>
                          {log.rootCause}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* STATISTICS TAB */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-6">
                  <h2 className="text-xs font-bold tracking-wider text-zinc-400 uppercase mb-4">Topic Mastery Matrix</h2>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={topicStats.slice(0, 10)}>
                        <PolarGrid stroke="#27272a" />
                        <PolarAngleAxis dataKey="topic" stroke="#71717a" fontSize={10} />
                        <PolarRadiusAxis stroke="#27272a" angle={30} domain={[0, 100]} />
                        <Radar name="Completion" dataKey="completion" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
                        <Radar name="Confidence" dataKey="avgConf" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Solve Time analysis */}
                  <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-6">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase mb-4">Average Solve Times (Mins)</h3>
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topicStats.filter(t => t.avgTime > 0)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#18181b" />
                          <XAxis dataKey="topic" stroke="#71717a" fontSize={9} />
                          <YAxis stroke="#71717a" fontSize={9} />
                          <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }} />
                          <Bar dataKey="avgTime" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Solved proportions */}
                  <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-zinc-400 uppercase mb-4">Readiness Forecast Breakdown</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-xs text-zinc-300 font-medium">
                            <span>Revision Progress</span>
                            <span>{solvedRevisions}/45 solved</span>
                          </div>
                          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${revisionProgressPercent}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs text-zinc-300 font-medium">
                            <span>Gap-Filling Progress</span>
                            <span>{solvedGaps}/15 solved</span>
                          </div>
                          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${gapProgressPercent}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-zinc-900 pt-4 mt-4 text-[10px] text-zinc-500 font-mono leading-relaxed">
                      *Stats update automatically upon logging solve times and ratings inside daily lists.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* RESOURCES TAB */}
            {activeTab === 'resources' && (
              <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-6 space-y-6">
                <div>
                  <h2 className="text-sm font-bold tracking-wider text-zinc-400 uppercase">Preparation Resources Hub</h2>
                  <p className="text-xs text-zinc-500 mt-1">Recommended lectures, cheat sheets, and articles curated for Infosys SP drives.</p>
                </div>

                <div className="divide-y divide-zinc-900">
                  {[
                    { topic: 'Arrays & Two Pointers', video: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-detailed-roadmap-and-pathwise-video/', doc: 'https://neetcode.io/practice', article: 'https://leetcode.com/discuss/study-guide/2009262/unifying-binary-search-array-methods-and-more' },
                    { topic: 'Sliding Window', video: 'https://takeuforward.org/data-structure/sliding-window-maximum/', doc: 'https://neetcode.io/practice', article: 'https://leetcode.com/discuss/study-guide/3602517/patterns-for-sliding-window' },
                    { topic: 'Binary Search', video: 'https://takeuforward.org/binary-search/binary-search-on-1d-arrays/', doc: 'https://neetcode.io/practice', article: 'https://leetcode.com/discuss/study-guide/786126/detailed-binary-search-introduction-types-and-patterns' },
                    { topic: 'Heaps & BST Gaps', video: 'https://takeuforward.org/data-structure/k-max-sum-combinations-from-two-arrays/', doc: 'https://neetcode.io/practice', article: 'https://leetcode.com/discuss/study-guide/1212004/binary-trees-study-guide-visualizations-and-patterns' },
                    { topic: 'Graphs (DFS/BFS/Dijkstra)', video: 'https://takeuforward.org/strivers-graph-series/strivers-graph-series-detailed-roadmap-video/', doc: 'https://neetcode.io/practice', article: 'https://leetcode.com/discuss/study-guide/2405625/graph-algorithms-study-guide-for-interviews' },
                    { topic: 'DP Basics', video: 'https://takeuforward.org/dynamic-programming/strivers-dp-series-dynamic-programming-post/', doc: 'https://neetcode.io/practice', article: 'https://leetcode.com/discuss/study-guide/1308601/dynamic-programming-patterns' }
                  ].map((resource, idx) => (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xs font-bold text-zinc-200">{resource.topic}</h3>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Videos + Guides</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <a href={resource.video} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">
                          <span>Video lectures</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <a href={resource.doc} target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-400 hover:text-zinc-300 font-semibold flex items-center gap-1">
                          <span>NeetCode Index</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* FLOATING MISSION AI ASSISTANT WIDGET */}
      <div className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {aiWidgetExpanded ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-zinc-900 border border-zinc-800 shadow-2xl rounded-2xl p-5 w-80 space-y-4 text-left relative overflow-hidden"
            >
              {/* Glow accent */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <Brain className="w-4.5 h-4.5 text-blue-400" />
                  <span className="text-xs font-bold text-zinc-200">Mission AI Assistant</span>
                </div>
                <button
                  onClick={() => setAiWidgetExpanded(false)}
                  className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-300 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-3 min-h-[90px] flex flex-col justify-between">
                <p className="text-xs font-mono text-zinc-300 leading-relaxed">
                  {assistantMessages[aiMessageIndex]}
                </p>
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleNextMessage}
                    className="text-[10px] text-zinc-400 hover:text-white font-mono flex items-center gap-0.5"
                  >
                    <span>Next update</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 text-[10px] font-mono text-zinc-500 border-t border-zinc-800 pt-3">
                <div className="flex justify-between">
                  <span>Day Targets remaining:</span>
                  <span className="font-bold text-zinc-300">
                    {state.problems.filter(p => p.day === state.activeDay && p.status !== 'Solved' && p.status !== 'Mastered').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Target Hours allocated:</span>
                  <span className="font-bold text-zinc-300">~{state.problems.filter(p => p.day === state.activeDay && p.status !== 'Solved' && p.status !== 'Mastered').length * 0.5}h</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.button
              onClick={() => setAiWidgetExpanded(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-full p-4 shadow-2xl flex items-center justify-center border border-blue-500/20"
            >
              <MessageSquare className="w-5.5 h-5.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ADAPTIVE REVISION ATTEMPT FORM MODAL */}
      <AnimatePresence>
        {isSubmitModalOpen && selectedProblem && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div>
                  <span className="text-[9px] text-zinc-500 font-mono font-bold uppercase">LOG ATTEMPT</span>
                  <h3 className="text-sm font-bold text-zinc-100">{selectedProblem.problemName}</h3>
                </div>
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-300"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Time taken input */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase font-mono mb-1.5 font-semibold">Time taken (Mins)</label>
                  <input
                    type="number"
                    value={submitTimeTaken}
                    onChange={(e) => setSubmitTimeTaken(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-700 font-mono"
                  />
                  <span className="text-[9px] text-zinc-500 block mt-1">
                    * &lt;10 mins = Green (Mastered), &gt;20 mins = Red (High Priority)
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase font-mono mb-1.5 font-semibold">Did you use a hint?</label>
                  <select
                    value={submitUsedHint}
                    onChange={(e) => setSubmitUsedHint(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-700"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes (Flags as High Priority)</option>
                  </select>
                </div>
              </div>

              {/* Confidence Stars Meter */}
              <div>
                <label className="block text-[10px] text-zinc-400 uppercase font-mono mb-1.5 font-semibold">Confidence Rating</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <button
                      key={starVal}
                      onClick={() => setSubmitConfidence(starVal)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star 
                        className={`w-6 h-6 transition-colors ${
                          starVal <= submitConfidence ? 'text-amber-500 fill-amber-500' : 'text-zinc-600'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Mistakes & Edge Cases input */}
              <div>
                <label className="block text-[10px] text-zinc-400 uppercase font-mono mb-1.5 font-semibold">Mistakes & Edge Cases</label>
                <textarea
                  value={submitMistakeText}
                  onChange={(e) => setSubmitMistakeText(e.target.value)}
                  placeholder="Record edge cases missed, off-by-one errors, infinite loops details..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-300 focus:outline-none focus:border-zinc-700 h-16 resize-none"
                />
              </div>

              {/* Custom Notes */}
              <div>
                <label className="block text-[10px] text-zinc-400 uppercase font-mono mb-1.5 font-semibold">Revision Notes / Tricks</label>
                <textarea
                  value={submitNotesText}
                  onChange={(e) => setSubmitNotesText(e.target.value)}
                  placeholder="Optimal code blocks, space complexity optimizations details..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-300 focus:outline-none focus:border-zinc-700 h-16 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-zinc-800 pt-3 mt-3">
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="text-xs font-bold border border-zinc-800 hover:bg-zinc-800 px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitProgress}
                  className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl transition-all"
                >
                  Confirm Log
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
