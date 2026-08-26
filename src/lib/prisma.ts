import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { captureAppError } from '@/lib/sentry'

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL || ''
  const pool = new Pool({
    connectionString,
    max: 10,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    ssl: { rejectUnauthorized: false },
  })

  // Tangkap error koneksi PostgreSQL Pool ke Sentry
  pool.on('error', (err) => {
    captureAppError(err, { source: 'PostgreSQL Pool Connection' })
  })

  const adapter = new PrismaPg(pool)
  const baseClient = new PrismaClient({ adapter })

  // Ekstensi Prisma untuk menangkap semua error query database ke Sentry
  return baseClient.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          try {
            return await query(args)
          } catch (error) {
            captureAppError(error, {
              source: 'Prisma Query Exception',
              model,
              operation,
            })
            throw error
          }
        },
      },
    },
  })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}

export default prisma

export function getExtendedClient(userId?: string) {
  if (!userId) return prisma;
  
  const claims = JSON.stringify({ sub: userId });
  
  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ args, query }) {
          const [, result] = await prisma.$transaction([
            prisma.$executeRaw`SELECT set_config('request.jwt.claims', ${claims}::text, TRUE)`,
            query(args),
          ]);
          return result;
        },
      },
    },
  });
}
