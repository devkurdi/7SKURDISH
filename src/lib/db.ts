import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL || ''

  // Check if we are using a PostgreSQL database (Neon, Vercel Postgres, etc.)
  const isPostgres = databaseUrl.startsWith('postgresql://') || databaseUrl.startsWith('postgres://')

  if (isPostgres) {
    try {
      // Use the Neon serverless adapter for PostgreSQL connections
      // This works with Vercel serverless functions
      const { PrismaNeon } = require('@prisma/adapter-neon')
      const { Pool } = require('@neondatabase/serverless')
      const pool = new Pool({ connectionString: databaseUrl })
      const adapter = new PrismaNeon(pool)
      return new PrismaClient({ adapter })
    } catch (error) {
      console.warn('Neon adapter failed, using standard PrismaClient:', error)
      return new PrismaClient()
    }
  }

  // For SQLite (local development) or other databases
  return new PrismaClient()
}

export const db =
  globalForPrisma.prisma ??
  createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
