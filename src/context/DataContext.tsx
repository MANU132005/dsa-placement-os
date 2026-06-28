'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { initialProblems, initialPatterns, initialCSTopics, Problem, Pattern, CSTopic } from '@/lib/seedData'

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
  score: number; // e.g. 0 to 100
  time: number; // mins
  accuracy: number; // e.g. 0 to 100
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

  // Load from localstorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProbs = localStorage.getItem('dsa_problems')
      const storedPats = localStorage.getItem('dsa_patterns')
      const storedCS = localStorage.getItem('dsa_cs_topics')
      const storedMocks = localStorage.getItem('dsa_mock_oas')
      const storedMistakes = localStorage.getItem('dsa_mistakes')
      const storedJournals = localStorage.getItem('dsa_journals')
      const storedCurrStrk = localStorage.getItem('dsa_curr_streak')
      const storedLongStrk = localStorage.getItem('dsa_long_streak')
      const storedTargets = localStorage.getItem('dsa_target_companies')

      if (storedProbs) setProblems(JSON.parse(storedProbs))
      else {
        localStorage.setItem('dsa_problems', JSON.stringify(initialProblems))
        setProblems(initialProblems)
      }

      if (storedPats) setPatterns(JSON.parse(storedPats))
      else {
        localStorage.setItem('dsa_patterns', JSON.stringify(initialPatterns))
        setPatterns(initialPatterns)
      }

      if (storedCS) setCsTopics(JSON.parse(storedCS))
      else {
        localStorage.setItem('dsa_cs_topics', JSON.stringify(initialCSTopics))
        setCsTopics(initialCSTopics)
      }

      if (storedMocks) setMockOAs(JSON.parse(storedMocks))
      if (storedMistakes) setMistakeLogs(JSON.parse(storedMistakes))
      if (storedJournals) setInterviewJournals(JSON.parse(storedJournals))
      
      if (storedCurrStrk) setCurrentStreak(parseInt(storedCurrStrk))
      if (storedLongStrk) setLongestStreak(parseInt(storedLongStrk))
      if (storedTargets) setTargetCompaniesState(JSON.parse(storedTargets))
    }
  }, [])

  // Sync to localstorage helpers
  const saveProblems = (data: Problem[]) => {
    setProblems(data)
    localStorage.setItem('dsa_problems', JSON.stringify(data))
  }

  const saveMockOAs = (data: MockOA[]) => {
    setMockOAs(data)
    localStorage.setItem('dsa_mock_oas', JSON.stringify(data))
  }

  const saveMistakes = (data: MistakeLog[]) => {
    setMistakeLogs(data)
    localStorage.setItem('dsa_mistakes', JSON.stringify(data))
  }

  const saveJournals = (data: InterviewJournal[]) => {
    setInterviewJournals(data)
    localStorage.setItem('dsa_journals', JSON.stringify(data))
  }

  const saveCSTopics = (data: CSTopic[]) => {
    setCsTopics(data)
    localStorage.setItem('dsa_cs_topics', JSON.stringify(data))
  }

  const setTargetCompanies = (data: string[]) => {
    setTargetCompaniesState(data)
    localStorage.setItem('dsa_target_companies', JSON.stringify(data))
  }

  // 1. Log Problem Attempt (with streak updates and Spaced Repetition scheduling)
  const logAttempt = (
    problemId: number,
    timeTaken: number,
    hintUsed: string,
    confidence: number,
    status: string,
    notes: string
  ) => {
    const todayStr = new Date().toISOString().split('T')[0]
    
    // Spaced repetition scheduling
    let daysToAdd = 30
    if (status === 'Yellow') daysToAdd = 7
    if (status === 'Red') daysToAdd = 2

    const nextRevDate = new Date()
    nextRevDate.setDate(nextRevDate.getDate() + daysToAdd)
    const nextRevStr = nextRevDate.toISOString().split('T')[0]

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

    saveProblems(updated)

    // Handle streak tracker
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
      localStorage.setItem('dsa_curr_streak', nextStreak.toString())

      if (nextStreak > longestStreak) {
        setLongestStreak(nextStreak)
        localStorage.setItem('dsa_long_streak', nextStreak.toString())
      }
    }
  }

  // 2. Add Mistake Log
  const addMistakeLog = (
    problemId: number,
    mistakeType: string,
    rootCause: string,
    solution: string
  ) => {
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
    saveMistakes([newLog, ...mistakeLogs])
  }

  // 3. Toggle Mistake Reviewed status
  const toggleMistakeReviewed = (id: string) => {
    const updated = mistakeLogs.map((log) => {
      if (log.id === id) {
        const nextStatus = log.reviewed === 'Yes' ? 'No' : 'Yes'
        return {
          ...log,
          reviewed: nextStatus,
          reviewDate: nextStatus === 'Yes' ? new Date().toISOString().split('T')[0] : null,
        }
      }
      return log
    })
    saveMistakes(updated)
  }

  // 4. Log Mock OA Performance
  const addMockOA = (
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
    // Calculate running average score
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
    saveMockOAs([newOA, ...mockOAs])
  }

  // 5. Update CS Topic revision status
  const updateCSTopic = (topicName: string, status: string, confidence: number) => {
    const todayStr = new Date().toISOString().split('T')[0]
    
    // Custom revision scheduling (30 days interval)
    const nextRevDate = new Date()
    nextRevDate.setDate(nextRevDate.getDate() + 30)
    const nextRevStr = nextRevDate.toISOString().split('T')[0]

    const updated = csTopics.map((topic) => {
      if (topic.topicName === topicName) {
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
    saveCSTopics(updated)
  }

  // 6. Log Interview Journal Round
  const addInterviewJournal = (
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
    saveJournals([newJournal, ...interviewJournals])
  }

  // 7. Reset Data to initial workbook seed
  const resetAllData = () => {
    localStorage.setItem('dsa_problems', JSON.stringify(initialProblems))
    localStorage.setItem('dsa_patterns', JSON.stringify(initialPatterns))
    localStorage.setItem('dsa_cs_topics', JSON.stringify(initialCSTopics))
    localStorage.removeItem('dsa_mock_oas')
    localStorage.removeItem('dsa_mistakes')
    localStorage.removeItem('dsa_journals')
    localStorage.setItem('dsa_curr_streak', '0')
    localStorage.setItem('dsa_long_streak', '0')

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
