/**
 * Tenant resolution: slug -> { tenantId, territoryId, franchiseId }.
 *
 * Commerce tenants live in their own schema. This is the single place that
 * maps a storefront hostname/path slug to commerce tenant context. It is
 * server-side only; the client never supplies tenantId directly.
 */
import { prisma } from "@/lib/prisma"
import { CommerceNotFoundError } from "../errors"
import type { ResolvedTenant } from "../types"

export async function resolveTenant(slug: string): Promise<ResolvedTenant> {
  // Commerce tenant is looked up in the commerce schema. We reuse the shared
  // Prisma client but query commerce models (see prisma/commerce/schema.prisma).
  const tenant = await prisma.commerceTenant.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      currency: true,
      franchiseeOrgId: true,
      territories: {
        where: { active: true },
        take: 1,
        select: {
          id: true,
          franchiseId: true,
        },
      },
    },
  })

  if (!tenant) {
    throw new CommerceNotFoundError(`Unknown commerce tenant: ${slug}`)
  }

  const territory = tenant.territories[0]
  if (!territory) {
    throw new CommerceNotFoundError(`No active territory for tenant: ${slug}`)
  }

  return {
    tenantId: tenant.id,
    territoryId: territory.id,
    franchiseId: territory.franchiseId,
    slug: tenant.slug,
    currency: tenant.currency,
  }
}
