import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

import { env } from "@/lib/env"
import type { MembershipRole, PermissionCode } from "@/lib/rbac"
import type { AuthorizationContext } from "@/lib/server/auth/authorization"

/**
 * Stateless JWT session management (server-only).
 *
 * Sessions are signed HS256 JWTs stored in an httpOnly cookie. This avoids a
 * session table for Phase 1 while keeping secrets server-side. If/when the data
 * layer adds a `Session` model, `verifySessionToken` can additionally check a
 * revocation list without changing call sites.
 */
export const SESSION_COOKIE = "fms_session"
const ALGORITHM = "HS256"
const SESSION_TTL = "7d"
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7

/** Claims carried inside the session token. */
export interface SessionPayload {
  /** User id (subject). */
  sub: string
  email: string
  name: string | null
  /** Active organization (tenant) id for this session. */
  org: string | null
  /** Persisted membership role within the active organization. */
  role: MembershipRole | null
}

function getSecretKey(): Uint8Array {
  if (!env.AUTH_SECRET) {
    throw new Error("AUTH_SECRET is required to create or verify sessions")
  }

  return new TextEncoder().encode(env.AUTH_SECRET)
}

/** Cookie attributes for the session token. */
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  }
}

/** Signs a session token for the given payload. */
export async function createSessionToken(
  payload: SessionPayload
): Promise<string> {
  const { sub, ...claims } = payload
  return new SignJWT(claims)
    .setProtectedHeader({ alg: ALGORITHM })
    .setSubject(sub)
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(getSecretKey())
}

/** Verifies a session token, returning the payload or null when invalid. */
export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: [ALGORITHM],
    })
    if (typeof payload.sub !== "string" || payload.sub.length === 0) return null

    const role =
      typeof payload.role === "string" ? (payload.role as MembershipRole) : null

    return {
      sub: payload.sub,
      email: typeof payload.email === "string" ? payload.email : "",
      name: typeof payload.name === "string" ? payload.name : null,
      org: typeof payload.org === "string" ? payload.org : null,
      role,
    }
  } catch {
    return null
  }
}

/** Reads and verifies the current request's httpOnly session cookie. */
export async function getCurrentSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (!token) return null
  return verifySessionToken(token)
}

/** Converts a SessionPayload into an AuthorizationContext for permission checks. */
export function toAuthorizationContext(
  payload: SessionPayload
): AuthorizationContext {
  return {
    userId: payload.sub,
    organizationId: payload.org ?? "",
    membershipRole: payload.role ?? undefined,
  }
}

/** Require organization context. Throws if not authenticated or no org assigned. */
export async function requireOrgContext(): Promise<AuthorizationContext> {
  const payload = await getCurrentSession()
  if (!payload || !payload.org) {
    throw new Error(
      "No organization context found. Sign in and join an organization first."
    )
  }
  return toAuthorizationContext(payload)
}
