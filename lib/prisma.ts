import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"

import { resolveDatabaseUrls } from "@/lib/database-urls"

const { runtimeUrl: databaseUrl } = resolveDatabaseUrls(process.env)

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be configured before Prisma can start")
}

const adapter = new PrismaPg({ connectionString: databaseUrl })

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
