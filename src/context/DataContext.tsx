'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { initialProblems, initialPatterns, initialCSTopics, Problem, Pattern, CSTopic } from '@/lib/seedData'
import { useAuth } from '@/context/AuthContext'
import { 
  fetchUserProgressAction, 
  saveAttemptAction, 
  addMistakeAction, 
  toggleMistakeAction, 
  addMockOAAction, 
  updateCSTopicAction, 
  addInterviewAction 
} from '@/app/actions/progressActions'

export interface MistakeLog {
  id: string;
  problemId: number;
  problemName: string;
  mistakeType: string;
  rootCause: string;
  solution: string;
  reviewed: string; // "Yes", "No"
  reviewDate?: string | null;
  createdAt: string;
}

export interface MockOA {
  id: string;
  company: string;
  date: string;
  questions: number;
  score: number;
  time: number;
  accuracy: number;
  weakPattern?: string;
  runningAverage?: number;
  mistakes?: string;
  action?: string;
  createdAt: string;
}

export interface InterviewJournal {
  id: string;
  company: string;
  date: string;
  round: string;
  questions: string;
  difficulty: string;
  mistakes?: string;
  feedback?: string;
  learnings?: string;
  revisionRequired: string; // "Yes", "No"
  createdAt: string;
}

interface DataContextType {
  problems: Problem[]
  patterns: Pattern[]
  csTopics: CSTopic[]
  mockOAs: MockOA[]
  mistakeLogs: MistakeLog[]
  interviewJournals: InterviewJournal[]
  currentStreak: number
  longestStreak: number
  targetCompanies: string[]
  isSyncing: boolean
  logAttempt: (
    problemId: number,
    timeTaken: number,
    hintUsed: string,
    confidence: number,
    status: string,
    notes: string
  ) => void
  addMistakeLog: (problemId: number, mistakeType: string, rootCause: string, solution: string) => void
  toggleMistakeReviewed: (id: string) => void
  addMockOA: (
    company: string,
    date: string,
    questions: number,
    score: number,
    time: number,
    accuracy: number,
    weakPattern: string,
    mistakes: string,
    action: string
  ) => void
  updateCSTopic: (topicName: string, status: string, confidence: number) => void
  addInterviewJournal: (
    company: string,
    date: string,
    round: string,
    questions: string,
    difficulty: string,
    mistakes: string,
    feedback: string,
    learnings: string,
    revisionRequired: string
  ) => void
  setTargetCompanies: (companies: string[]) => void
  resetAllData: () => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  
  const [problems, setProblems] = useState<Problem[]>([])
  const [patterns, setPatterns] = useState<Pattern[]>([])
  const [csTopics, setCsTopics] = useState<CSTopic[]>([])
  const [mockOAs, setMockOAs] = useState<MockOA[]>([])
  const [mistakeLogs, setMistakeLogs] = useState<MistakeLog[]>([])
  const [interviewJournals, setInterviewJournals] = useState<InterviewJournal[]>([])
  const [currentStreak, setCurrentStreak] = useState<number>(0)
  const [longestStreak, setLongestStreak] = useState<number>(0)
  const [targetCompanies, setTargetCompaniesState] = useState<string[]>([
    "Accenture", "Infosys", "Capgemini", "Cognizant", "Deloitte", "EY", "Oracle", "JPMC", "LTIMindtree", "Virtusa"
  ])
  const [isSyncing, setIsSyncing] = useState(false)

  // Fetch or Load User Isolated Data when User changes
  useEffect(() => {
    if (!user) {
      // Clear data state on logout
      setProblems([])
      setCsTopics([])
      setMockOAs([])
      setMistakeLogs([])
      setInterviewJournals([])
      setCurrentStreak(0)
      setLongestStreak(0)
      return
    }

    async function loadUserData() {
      setIsSyncing(true)
      try {
        const res = await fetchUserProgressAction(user.id)
        if (res.success && res.data) {
          const { progress, mistakes, mockOAs: oas, csProgress, interviewJournals: journals, notes } = res.data

          // 1. Merge Shared Problems with User Progress
          const progressMap = new Map(progress.map((p: any) => [p.problemId, p]))
          const mergedProblems = initialProblems.map((prob) => {
            const prog: any = progressMap.get(prob.id)
            if (prog) {
              return {
                ...prob,
                status: prog.status,
                confidence: prog.confidence,
                timeTaken: prog.timeTaken,
                hintUsed: prog.hintUsed,
                attemptDate: prog.solveDate ? new Date(prog.solveDate).toISOString().split('T')[0] : null,
                nextRevision: prog.nextRevision ? new Date(prog.nextRevision).toISOString().split('T')[0] : null,
                revisionCount: prog.revisionCount || 0,
                notes: prog.notes,
              }
            }
            return prob
          })
          setProblems(mergedProblems)

          // 2. Load mistakes
          setMistakeLogs(mistakes.map((m: any) => ({
            id: m.id,
            problemId: m.problemId,
            problemName: m.problemName,
            mistakeType: m.mistakeType,
            rootCause: m.rootCause,
            solution: m.solution,
            reviewed: m.reviewed,
            reviewDate: m.reviewDate ? new Date(m.reviewDate).toISOString().split('T')[0] : null,
            createdAt: m.createdAt.toISOString()
          })))

          // 3. Load Mock OAs
          setMockOAs(oas.map((o: any) => ({
            id: o.id,
            company: o.company,
            date: o.date ? new Date(o.date).toISOString().split('T')[0] : '',
            questions: o.questions,
            score: o.score,
            time: o.time,
            accuracy: o.accuracy,
            weakPattern: o.weakPattern || 'None',
            runningAverage: o.runningAverage || 0,
            mistakes: o.mistakes || '',
            action: o.action || '',
            createdAt: o.createdAt.toISOString()
          })))

          // 4. Load CS Progress
          const csMap = new Map(csProgress.map((c: any) => [c.topicName, c]))
          setCsTopics(initialCSTopics.map((topic) => {
            const prog: any = csMap.get(topic.topicName)
            if (prog) {
              return {
                ...topic,
                status: prog.status,
                confidence: prog.confidence,
                lastRevised: prog.lastRevised ? new Date(prog.lastRevised).toISOString().split('T')[0] : null,
                nextRevision: prog.nextRevision ? new Date(prog.nextRevision).toISOString().split('T')[0] : null,
              }
            }
            return topic
          }))

          // 5. Load Interviews
          setInterviewJournals(journals.map((j: any) => ({
            id: j.id,
            company: j.company,
            date: j.date ? new Date(j.date).toISOString().split('T')[0] : '',
            round: j.round,
            questions: j.questions,
            difficulty: j.difficulty,
            mistakes: j.mistakes || '',
            feedback: j.feedback || '',
            learnings: j.learnings || '',
            revisionRequired: j.revisionRequired,
            createdAt: j.createdAt.toISOString()
          })))

          // Set patterns reference
          setPatterns(initialPatterns)

          // Load streaks (calculated on-the-fly from actual attempts or mock saved)
          const storedCurrStrk = localStorage.getItem(`dsa_${user.id}_curr_streak`)
          const storedLongStrk = localStorage.getItem(`dsa_${user.id}_long_streak`)
          if (storedCurrStrk) setCurrentStreak(parseInt(storedCurrStrk))
          if (storedLongStrk) setLongestStreak(parseInt(storedLongStrk))

          // Load target companies
          const storedTargets = localStorage.getItem(`dsa_${user.id}_target_companies`)
          if (storedTargets) setTargetCompaniesState(JSON.parse(storedTargets))
        } else {
          // DATABASE OFFLINE FALLBACK: load user isolated namespace local storage
          loadLocalFallback(user.id)
        }
      } catch (err) {
        console.error('Fetch user progress error:', err)
        loadLocalFallback(user.id)
      } finally {
        setIsSyncing(false)
      }
    }

    loadUserData()
  }, [user])

  // Offline local fallback loader
  const loadLocalFallback = (uid: string) => {
    const storedProbs = localStorage.getItem(`dsa_${uid}_problems`)
    const storedCS = localStorage.getItem(`dsa_${uid}_cs_topics`)
    const storedMocks = localStorage.getItem(`dsa_${uid}_mock_oas`)
    const storedMistakes = localStorage.getItem(`dsa_${uid}_mistakes`)
    const storedJournals = localStorage.getItem(`dsa_${uid}_journals`)
    const storedCurrStrk = localStorage.getItem(`dsa_${uid}_curr_streak`)
    const storedLongStrk = localStorage.getItem(`dsa_${uid}_long_streak`)
    const storedTargets = localStorage.getItem(`dsa_${uid}_target_companies`)

    setProblems(storedProbs ? JSON.parse(storedProbs) : initialProblems)
    setPatterns(initialPatterns)
    setCsTopics(storedCS ? JSON.parse(storedCS) : initialCSTopics)
    setMockOAs(storedMocks ? JSON.parse(storedMocks) : [])
    setMistakeLogs(storedMistakes ? JSON.parse(storedMistakes) : [])
    setInterviewJournals(storedJournals ? JSON.parse(storedJournals) : [])
    setCurrentStreak(storedCurrStrk ? parseInt(storedCurrStrk) : 0)
    setLongestStreak(storedLongStrk ? parseInt(storedLongStrk) : 0)
    
    if (storedTargets) setTargetCompaniesState(JSON.parse(storedTargets))
  }

  // Local sync triggers
  const saveProblemsLocally = (uid: string, data: Problem[]) => {
    setProblems(data)
    localStorage.setItem(`dsa_${uid}_problems`, JSON.stringify(data))
  }

  const saveMockOAsLocally = (uid: string, data: MockOA[]) => {
    setMockOAs(data)
    localStorage.setItem(`dsa_${uid}_mock_oas`, JSON.stringify(data))
  }

  const saveMistakesLocally = (uid: string, data: MistakeLog[]) => {
    setMistakeLogs(data)
    localStorage.setItem(`dsa_${uid}_mistakes`, JSON.stringify(data))
  }

  const saveJournalsLocally = (uid: string, data: InterviewJournal[]) => {
    setInterviewJournals(data)
    localStorage.setItem(`dsa_${uid}_journals`, JSON.stringify(data))
  }

  const saveCSTopicsLocally = (uid: string, data: CSTopic[]) => {
    setCsTopics(data)
    localStorage.setItem(`dsa_${uid}_cs_topics`, JSON.stringify(data))
  }

  const setTargetCompanies = (data: string[]) => {
    if (!user) return
    setTargetCompaniesState(data)
    localStorage.setItem(`dsa_${user.id}_target_companies`, JSON.stringify(data))
  }

  // 1. Log Attempt Auto-Save
  const logAttempt = async (
    problemId: number,
    timeTaken: number,
    hintUsed: string,
    confidence: number,
    status: string,
    notes: string
  ) => {
    if (!user) return
    setIsSyncing(true)
    
    const todayStr = new Date().toISOString().split('T')[0]
    
    // Spaced Repetition delta
    let daysToAdd = 30
    if (status === 'Yellow') daysToAdd = 7
    if (status === 'Red') daysToAdd = 2

    const nextRevDate = new Date()
    nextRevDate.setDate(nextRevDate.getDate() + daysToAdd)
    const nextRevStr = nextRevDate.toISOString().split('T')[0]

    // Local state merge
    const updated = problems.map((prob) => {
      if (prob.id === problemId) {
        const prevAttempt = prob.attemptDate
        return {
          ...prob,
          attemptDate: todayStr,
          timeTaken,
          hintUsed,
          confidence,
          status,
          notes,
          revisionCount: prevAttempt ? (prob.revisionCount || 0) + 1 : 0,
          nextRevision: nextRevStr,
        }
      }
      return prob
    })

    // 1. Update server database
    try {
      await saveAttemptAction(user.id, problemId, status, confidence, timeTaken, hintUsed, notes, nextRevStr)
    } catch (err) {
      console.warn('Server progress write offline. Syncing locally.')
    }

    // 2. Save locally
    saveProblemsLocally(user.id, updated)

    // Streak logic
    const alreadySolvedToday = problems.some(
      (p) => p.attemptDate === todayStr && p.id !== problemId
    )
    if (!alreadySolvedToday) {
      const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      const solvedYesterday = problems.some((p) => p.attemptDate === yesterdayStr)
      
      let nextStreak = 1
      if (solvedYesterday) {
        nextStreak = currentStreak + 1
      }
      setCurrentStreak(nextStreak)
      localStorage.setItem(`dsa_${user.id}_curr_streak`, nextStreak.toString())

      if (nextStreak > longestStreak) {
        setLongestStreak(nextStreak)
        localStorage.setItem(`dsa_${user.id}_long_streak`, nextStreak.toString())
      }
    }
    
    setIsSyncing(false)
  }

  // 2. Add Mistake Auto-Save
  const addMistakeLog = async (
    problemId: number,
    mistakeType: string,
    rootCause: string,
    solution: string
  ) => {
    if (!user) return
    setIsSyncing(true)

    const problemName = problems.find((p) => p.id === problemId)?.name || 'Unknown Problem'
    const newLog: MistakeLog = {
      id: crypto.randomUUID(),
      problemId,
      problemName,
      mistakeType,
      rootCause,
      solution,
      reviewed: 'No',
      createdAt: new Date().toISOString(),
    }

    // 1. Write server db
    try {
      const res = await addMistakeAction(user.id, problemId, problemName, mistakeType, rootCause, solution)
      if (res.success && res.data) {
        newLog.id = res.data.id // bind real database id
      }
    } catch (err) {
      console.warn('Mistakes write offline.')
    }

    // 2. Write locally
    saveMistakesLocally(user.id, [newLog, ...mistakeLogs])
    setIsSyncing(false)
  }

  // 3. Toggle Mistake Auto-Save
  const toggleMistakeReviewed = async (id: string) => {
    if (!user) return
    setIsSyncing(true)

    const updated = mistakeLogs.map((log) => {
      if (log.id === id) {
        const nextStatus = log.reviewed === 'Yes' ? 'No' : 'Yes'
        const nextDate = nextStatus === 'Yes' ? new Date().toISOString().split('T')[0] : null
        
        // Write server db async
        toggleMistakeAction(user.id, id, nextStatus, nextDate).catch(() => {})
        
        return {
          ...log,
          reviewed: nextStatus,
          reviewDate: nextDate,
        }
      }
      return log
    })

    saveMistakesLocally(user.id, updated)
    setIsSyncing(false)
  }

  // 4. Log Mock OA Auto-Save
  const addMockOA = async (
    company: string,
    date: string,
    questions: number,
    score: number,
    time: number,
    accuracy: number,
    weakPattern: string,
    mistakes: string,
    action: string
  ) => {
    if (!user) return
    setIsSyncing(true)

    const totalScores = mockOAs.reduce((sum, item) => sum + item.score, 0) + score
    const runningAverage = parseFloat((totalScores / (mockOAs.length + 1)).toFixed(1))

    const newOA: MockOA = {
      id: crypto.randomUUID(),
      company,
      date,
      questions,
      score,
      time,
      accuracy,
      weakPattern,
      runningAverage,
      mistakes,
      action,
      createdAt: new Date().toISOString(),
    }

    // 1. Server db write
    try {
      const res = await addMockOAAction(
        user.id, company, date, questions, score, time, accuracy, weakPattern, runningAverage, mistakes, action
      )
      if (res.success && res.data) {
        newOA.id = res.data.id
      }
    } catch (err) {
      console.warn('OAs write offline.')
    }

    // 2. Save locally
    saveMockOAsLocally(user.id, [newOA, ...mockOAs])
    setIsSyncing(false)
  }

  // 5. CS Topics Auto-Save
  const updateCSTopic = async (topicName: string, status: string, confidence: number) => {
    if (!user) return
    setIsSyncing(true)

    const todayStr = new Date().toISOString().split('T')[0]
    const nextRevDate = new Date()
    nextRevDate.setDate(nextRevDate.getDate() + 30)
    const nextRevStr = nextRevDate.toISOString().split('T')[0]

    const updated = csTopics.map((topic) => {
      if (topic.topicName === topicName) {
        // Server db write
        updateCSTopicAction(user.id, topicName, topic.resourceLink, status, confidence, nextRevStr).catch(() => {})

        return {
          ...topic,
          status,
          confidence,
          lastRevised: todayStr,
          nextRevision: nextRevStr,
        }
      }
      return topic
    })

    saveCSTopicsLocally(user.id, updated)
    setIsSyncing(false)
  }

  // 6. Interview rounds Auto-Save
  const addInterviewJournal = async (
    company: string,
    date: string,
    round: string,
    questions: string,
    difficulty: string,
    mistakes: string,
    feedback: string,
    learnings: string,
    revisionRequired: string
  ) => {
    if (!user) return
    setIsSyncing(true)

    const newJournal: InterviewJournal = {
      id: crypto.randomUUID(),
      company,
      date,
      round,
      questions,
      difficulty,
      mistakes,
      feedback,
      learnings,
      revisionRequired,
      createdAt: new Date().toISOString(),
    }

    // 1. Server db write
    try {
      const res = await addInterviewAction(
        user.id, company, date, round, questions, difficulty, mistakes, feedback, learnings, revisionRequired
      )
      if (res.success && res.data) {
        newJournal.id = res.data.id
      }
    } catch (err) {
      console.warn('Interviews write offline.')
    }

    // 2. Save locally
    saveJournalsLocally(user.id, [newJournal, ...interviewJournals])
    setIsSyncing(false)
  }

  // 7. Reset User Specific Data
  const resetAllData = () => {
    if (!user) return
    
    // Clear user isolated keys
    localStorage.removeItem(`dsa_${user.id}_problems`)
    localStorage.removeItem(`dsa_${user.id}_cs_topics`)
    localStorage.removeItem(`dsa_${user.id}_mock_oas`)
    localStorage.removeItem(`dsa_${user.id}_mistakes`)
    localStorage.removeItem(`dsa_${user.id}_journals`)
    localStorage.setItem(`dsa_${user.id}_curr_streak`, '0')
    localStorage.setItem(`dsa_${user.id}_long_streak`, '0')

    setProblems(initialProblems)
    setPatterns(initialPatterns)
    setCsTopics(initialCSTopics)
    setMockOAs([])
    setMistakeLogs([])
    setInterviewJournals([])
    setCurrentStreak(0)
    setLongestStreak(0)
  }

  return (
    <DataContext.Provider
      value={{
        problems,
        patterns,
        csTopics,
        mockOAs,
        mistakeLogs,
        interviewJournals,
        currentStreak,
        longestStreak,
        targetCompanies,
        isSyncing,
        logAttempt,
        addMistakeLog,
        toggleMistakeReviewed,
        addMockOA,
        updateCSTopic,
        addInterviewJournal,
        setTargetCompanies,
        resetAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
