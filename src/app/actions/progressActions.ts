'use server'

import { prisma } from '@/lib/prisma'
import { ActionResponse } from './authActions'

const isDummyDb = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes('johndoe')

// 1. Fetch User Data
export async function fetchUserProgressAction(
  userId: string
): Promise<ActionResponse> {
  if (isDummyDb) {
    return { success: false, error: 'Database connection offline.' }
  }
  try {
    const progress = await prisma.userProgress.findMany({ where: { userId } })
    const mistakes = await prisma.mistakeLog.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
    const mockOAs = await prisma.mockOA.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
    const csProgress = await prisma.cSTopicProgress.findMany({ where: { userId } })
    const interviewJournals = await prisma.interviewJournal.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
    const notes = await prisma.note.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' } })

    return {
      success: true,
      data: {
        progress,
        mistakes,
        mockOAs,
        csProgress,
        interviewJournals,
        notes,
      },
    }
  } catch (err) {
    console.error('Fetch Progress Error:', err)
    return { success: false, error: 'Database fetch failed. Running in Local Offline Mode.' }
  }
}

// 2. Save Solved Problem Progress Attempt
export async function saveAttemptAction(
  userId: string,
  problemId: number,
  status: string,
  confidence: number,
  timeTaken: number,
  hintUsed: string,
  notes: string,
  nextRevision: string | null
): Promise<ActionResponse> {
  if (isDummyDb) {
    return { success: false, error: 'Database connection offline.' }
  }
  try {
    const nextRevisionDate = nextRevision ? new Date(nextRevision) : null
    
    // Check if progress already exists
    const existing = await prisma.userProgress.findUnique({
      where: {
        userId_problemId: { userId, problemId }
      }
    })

    const revisionCount = existing ? (existing.revisionCount || 0) + 1 : 0

    const record = await prisma.userProgress.upsert({
      where: {
        userId_problemId: { userId, problemId }
      },
      update: {
        status,
        confidence,
        timeTaken,
        hintUsed,
        solveDate: new Date(),
        nextRevision: nextRevisionDate,
        revisionCount,
        notes,
      },
      create: {
        userId,
        problemId,
        status,
        confidence,
        timeTaken,
        hintUsed,
        solveDate: new Date(),
        nextRevision: nextRevisionDate,
        revisionCount,
        notes,
      }
    })

    return { success: true, data: record }
  } catch (err) {
    console.error('Save Attempt Error:', err)
    return { success: false, error: 'Save failed.' }
  }
}

// 3. Add Mistake Log
export async function addMistakeAction(
  userId: string,
  problemId: number,
  problemName: string,
  mistakeType: string,
  rootCause: string,
  solution: string
): Promise<ActionResponse> {
  if (isDummyDb) {
    return { success: false, error: 'Database connection offline.' }
  }
  try {
    const record = await prisma.mistakeLog.create({
      data: {
        userId,
        problemId,
        problemName,
        mistakeType,
        rootCause,
        solution,
      }
    })
    return { success: true, data: record }
  } catch (err) {
    return { success: false, error: 'Failed to add mistake.' }
  }
}

// 4. Toggle Mistake Reviewed status
export async function toggleMistakeAction(
  userId: string,
  id: string,
  reviewed: string,
  reviewDate: string | null
): Promise<ActionResponse> {
  if (isDummyDb) {
    return { success: false, error: 'Database connection offline.' }
  }
  try {
    const record = await prisma.mistakeLog.update({
      where: { id },
      data: {
        reviewed,
        reviewDate: reviewDate ? new Date(reviewDate) : null,
      }
    })
    return { success: true, data: record }
  } catch (err) {
    return { success: false, error: 'Failed to update mistake status.' }
  }
}

// 5. Add Mock OA Log
export async function addMockOAAction(
  userId: string,
  company: string,
  date: string,
  questions: number,
  score: number,
  time: number,
  accuracy: number,
  weakPattern: string,
  runningAverage: number,
  mistakes: string,
  action: string
): Promise<ActionResponse> {
  if (isDummyDb) {
    return { success: false, error: 'Database connection offline.' }
  }
  try {
    const record = await prisma.mockOA.create({
      data: {
        userId,
        company,
        date: new Date(date),
        questions,
        score,
        time,
        accuracy,
        weakPattern,
        runningAverage,
        mistakes,
        action,
      }
    })
    return { success: true, data: record }
  } catch (err) {
    return { success: false, error: 'Failed to add mock OA.' }
  }
}

// 6. Update CS Topic Progress
export async function updateCSTopicAction(
  userId: string,
  topicName: string,
  resourceLink: string,
  status: string,
  confidence: number,
  nextRevision: string | null
): Promise<ActionResponse> {
  if (isDummyDb) {
    return { success: false, error: 'Database connection offline.' }
  }
  try {
    const record = await prisma.cSTopicProgress.upsert({
      where: {
        userId_topicName: { userId, topicName }
      },
      update: {
        status,
        confidence,
        lastRevised: new Date(),
        nextRevision: nextRevision ? new Date(nextRevision) : null,
      },
      create: {
        userId,
        topicName,
        resourceLink,
        status,
        confidence,
        lastRevised: new Date(),
        nextRevision: nextRevision ? new Date(nextRevision) : null,
      }
    })
    return { success: true, data: record }
  } catch (err) {
    return { success: false, error: 'Failed to update CS topic.' }
  }
}

// 7. Add Interview Journal Log
export async function addInterviewAction(
  userId: string,
  company: string,
  date: string,
  round: string,
  questions: string,
  difficulty: string,
  mistakes: string,
  feedback: string,
  learnings: string,
  revisionRequired: string
): Promise<ActionResponse> {
  if (isDummyDb) {
    return { success: false, error: 'Database connection offline.' }
  }
  try {
    const record = await prisma.interviewJournal.create({
      data: {
        userId,
        company,
        date: new Date(date),
        round,
        questions,
        difficulty,
        mistakes,
        feedback,
        learnings,
        revisionRequired,
      }
    })
    return { success: true, data: record }
  } catch (err) {
    return { success: false, error: 'Failed to add interview round.' }
  }
}

// 8. Update User Onboarding Target Watchlist and Academic Settings
export async function updateUserOnboardingAction(
  userId: string,
  dailyGoal: number,
  currentYear: string
): Promise<ActionResponse> {
  if (isDummyDb) {
    return { success: false, error: 'Database connection offline.' }
  }
  try {
    const record = await prisma.user.update({
      where: { id: userId },
      data: {
        dailyGoal,
        currentYear,
      }
    })
    return { success: true, data: record }
  } catch (err) {
    return { success: false, error: 'Failed to update onboarding settings.' }
  }
}
