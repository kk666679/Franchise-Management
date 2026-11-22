import dotenv from "dotenv"
import { defineConfig } from "@prisma/prisma7/config"

dotenv.config({ path: ".env.local" })
dotenv.config({ path: ".env" })

const databaseUrl =
  process.env.DIRECT_DATABASE_URL ??
  process.env.PRISMA_DATABASE_URL ??
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.POSTGRES_URL ??
  process.env.DATABASE_URL ??
  process.env.DATABASE_URL_POOLED

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: databaseUrl,
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  },
})
