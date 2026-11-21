import { z } from "zod"

/**
 * Runtime environment contract.
 *
 * All environment access is centralized here so that (a) invalid or missing
 * values fail fast with a clear message, and (b) secrets are never referenced
 * ad-hoc from deep inside business logic.
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  APP_URL: z.string().url().default("http://localhost:3000"),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DIRECT_DATABASE_URL: z.string().min(1).optional(),
  SHADOW_DATABASE_URL: z.string().min(1).optional(),

  AUTH_SECRET: z.string().min(16, "AUTH_SECRET must be at least 16 characters"),
  REDIS_URL: z.string().optional(),

  S3_ENDPOINT: z.string().optional(),
  S3_REGION: z.string().default("auto"),
  S3_BUCKET: z.string().default("franchise-uploads"),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),

  EMAIL_FROM: z.string().default("Franchise Management <no-reply@example.com>"),

  AI_DEFAULT_MODEL: z.string().optional(),
})

/**
 * Parsed environment. Import this instead of reading `process.env` directly.
 *
 * NOTE: this module runs on the server only. It is never imported from a
 * Server Component boundary that would leak values to the browser bundle.
 */
export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  APP_URL: process.env.APP_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_DATABASE_URL: process.env.DIRECT_DATABASE_URL,
  SHADOW_DATABASE_URL: process.env.SHADOW_DATABASE_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  REDIS_URL: process.env.REDIS_URL,
  S3_ENDPOINT: process.env.S3_ENDPOINT,
  S3_REGION: process.env.S3_REGION,
  S3_BUCKET: process.env.S3_BUCKET,
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  AI_DEFAULT_MODEL: process.env.AI_DEFAULT_MODEL,
})

export type Env = z.infer<typeof envSchema>