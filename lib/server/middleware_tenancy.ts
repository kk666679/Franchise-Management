/** Tenancy middleware for organization-scoped server components and API routes.
 *
 * Provides helpers to extract the current organization context from session
 * and enforce that all database queries are scoped to that organization.
 *
 * Uses the canonical custom JWT session (`lib/server/auth/session.ts`) as the
 * single source of truth for authentication context.
 */

import { getCurrentSession, type SessionPayload } from "@/lib/server/auth/session"
import { toAuthorizationContext } from "@/lib/server/auth/session"
import {
  assertOrganizationAccess,
  type AuthorizationContext,
} from "@/lib/server/auth/authorization"
import { prisma } from "@/lib/prisma"

/** Extract organization context from the current session. */
export async function getOrganizationContext(): Promise<AuthorizationContext | null> {
  const payload = await getCurrentSession()
  if (!payload) return null
  return toAuthorizationContext(payload)
}

/** Require organization context. Throws if not authenticated or no org assigned. */
export async function requireOrganization(): Promise<AuthorizationContext> {
  const ctx = await getOrganizationContext()
  if (!ctx || !ctx.organizationId) {
    throw new Error("No organization context found. Sign in and join an organization first.")
  }
  return ctx
}

/** Prisma wrapper that adds organizationId filter to queries.
 *
 * Usage: `await prisma.invoice.findMany(withOrg(await requireOrganization()))`
 */
export function withOrg(ctx: AuthorizationContext) {
  return { where: { organizationId: ctx.organizationId } }
}

/** Assert that the current org context can access the given organization. */
export async function assertOrgAccess(organizationId: string): Promise<AuthorizationContext> {
  const ctx = await requireOrganization()
  assertOrganizationAccess(ctx, organizationId)
  return ctx
}

/** Create an organization-scoped query helper for common models. */
export function orgScoped<T>(
  ctx: AuthorizationContext,
  model:
    | "organization"
    | "user"
    | "membership"
    | "franchiseBrand"
    | "franchisee"
    | "franchiseLocation"
    | "invoice"
    | "financialAccount"
    | "journalEntry"
    | "payment"
    | "customer"
    | "product"
    | "sale"
    | "supportTicket"
    | "auditLog",
) {
  return { where: { organizationId: ctx.organizationId } } as {
    where: { organizationId: string }
  }
}
