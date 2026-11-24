const WARNED_SSL_MODES = new Set(["prefer", "require", "verify-ca"])

function normalizeDatabaseUrl(url: string | undefined) {
  if (!url) return url

  try {
    const parsed = new URL(url)
    const sslmode = parsed.searchParams.get("sslmode")
    const libpqCompat =
      parsed.searchParams.get("uselibpqcompat")?.toLowerCase() === "true"

    if (sslmode && WARNED_SSL_MODES.has(sslmode.toLowerCase()) && !libpqCompat) {
      parsed.searchParams.set("sslmode", "verify-full")
      return parsed.toString()
    }

    return url
  } catch {
    return url
  }
}

/** Resolve the connection variables used by Prisma Postgres and Vercel Postgres. */
export function resolveDatabaseUrls(
  source: Record<string, string | undefined>
) {
  const runtimeUrl = normalizeDatabaseUrl(
    source.DATABASE_URL ??
      source.DATABASE_URL_POOLED ??
      source.POSTGRES_URL ??
      source.PRISMA_DATABASE_URL
  )

  const directUrl = normalizeDatabaseUrl(
    source.DIRECT_DATABASE_URL ??
      source.PRISMA_DATABASE_URL ??
      source.POSTGRES_URL_NON_POOLING ??
      source.POSTGRES_URL ??
      source.DATABASE_URL ??
      source.DATABASE_URL_POOLED
  )

  return { runtimeUrl, directUrl }
}
