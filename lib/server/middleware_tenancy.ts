import type { MembershipRole } from "@/lib/rbac"
/** Tenancy middleware for organization-scoped server components and API routes.
 *
 * Provides helpers to extract the current organization context from session
 * and enforce that all database queries are scoped to that organization.
 */

import { authOptions } from "@/lib/server/auth/config"
import { getServerSession } from "next-auth/next"
import { assertOrganizationAccess, type AuthorizationContext } from "@/lib/server/auth/authorization"
import { prisma } from "@/lib/prisma"

/** Extract organization context from the current session. */
export async function getOrganizationContext(): Promise<AuthorizationContext | null> {
  const session = (await getServerSession(authOptions)) as { user?: { id: string; organizationId?: string; role?: import("@/lib/rbac").MembershipRole } } | null

  if (!session?.user) return null

  return {
    userId: session.user.id,
    organizationId: session.user.organizationId ?? "",
    membershipRole: session.user.role as import("@/lib/rbac").MembershipRole | undefined,
  }
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
  model: "organization" | "user" | "membership" | "franchiseBrand" | "franchisee" | "franchiseLocation" | "invoice" | "financialAccount" | "journalEntry" | "payment" | "customer" | "product" | "sale" | "supportTicket" | "auditLog",
) {
  return { where: { organizationId: ctx.organizationId } } as { where: { organizationId: string } }
}