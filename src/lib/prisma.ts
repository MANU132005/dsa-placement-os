import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Prisma 7 requires passing either an adapter or accelerateUrl to the constructor.
// We use a fallback prisma:// placeholder for local offline mode to prevent import/evaluation crashes.
const connectionUrl = process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('prisma://')
  ? process.env.DATABASE_URL
  : 'prisma://placeholder-for-local-offline-mode'

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  accelerateUrl: connectionUrl
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
