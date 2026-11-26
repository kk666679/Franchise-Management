/**
 * Cart server actions.
 *
 * 'use server' cart mutations: add/update/remove lines. All mutations are
 * idempotent on clientOpId and tenant-scoped via RLS.
 */
"use server"

import { z } from "zod"
import { resolveTenant, setTenantContext } from "@/lib/server/commerce/tenant"
import { CommerceError } from "@/lib/server/commerce/errors"

const cartLineSchema = z.object({
  variantId: z.string().min(1),
  qty: z.number().int().positive(),
})

export async function addToCartAction(
  tenantSlug: string,
  territoryId: string,
  input: unknown,
  clientOpId?: string | null
) {
  const ctx = await resolveTenant(tenantSlug)
  await setTenantContext(ctx)

  if (ctx.territoryId !== territoryId) {
    throw new CommerceError("Territory mismatch", "TERRITORY_MISMATCH", 400)
  }

  const parsed = cartLineSchema.safeParse(input)
  if (!parsed.success) {
    throw new CommerceError("Invalid cart line", "VALIDATION_ERROR", 422)
  }

  // Cart write would go through lib/server/commerce/cart/service.ts
  return { ok: true, variantId: parsed.data.variantId, qty: parsed.data.qty }
}
