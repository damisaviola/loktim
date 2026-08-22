import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL || ''
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
} & typeof global;

const prisma = process.env.NODE_ENV === 'production' 
  ? (globalThis.prismaGlobal ?? prismaClientSingleton())
  : (globalThis.prismaGlobal && 'contactMessage' in globalThis.prismaGlobal ? globalThis.prismaGlobal : prismaClientSingleton())

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

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
