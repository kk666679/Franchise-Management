/** Resolve the connection variables used by Prisma Postgres and Vercel Postgres. */
export function resolveDatabaseUrls(
  source: Record<string, string | undefined>
) {
  const runtimeUrl =
    source.DATABASE_URL ??
    source.DATABASE_URL_POOLED ??
    source.POSTGRES_URL ??
    source.PRISMA_DATABASE_URL

  const directUrl =
    source.DIRECT_DATABASE_URL ??
    source.PRISMA_DATABASE_URL ??
    source.POSTGRES_URL_NON_POOLING ??
    source.POSTGRES_URL ??
    source.DATABASE_URL ??
    source.DATABASE_URL_POOLED

  return { runtimeUrl, directUrl }
}
