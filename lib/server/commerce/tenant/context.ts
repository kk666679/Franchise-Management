/**
 * RequestCommerceContext.
 *
 * Sets PostgreSQL session-level RLS variables (app.tenant_id, app.territory_id)
 * per request so RLS policies are the database backstop for tenant isolation.
 */
import { prisma } from "@/lib/prisma"
import type { ResolvedTenant } from "../types"

/** Set tenant/territory session variables for RLS enforcement. */
export async function setTenantContext(ctx: ResolvedTenant): Promise<void> {
  await prisma.$executeRaw`SELECT set_config('app.tenant_id', ${ctx.tenantId}, true)`
  await prisma.$executeRaw`SELECT set_config('app.territory_id', ${ctx.territoryId}, true)`
}

/** Clear tenant/territory session variables after the request. */
export async function clearTenantContext(): Promise<void> {
  await prisma.$executeRaw`SELECT set_config('app.tenant_id', '', true)`
  await prisma.$executeRaw`SELECT set_config('app.territory_id', '', true)`
}

/**
 * Run a callback with tenant context set and cleared afterwards.
 */
export async function withTenantContext<T>(
  ctx: ResolvedTenant,
  cb: () => Promise<T>
): Promise<T> {
  await setTenantContext(ctx)
  try {
    return await cb()
  } finally {
    await clearTenantContext()
  }
}
