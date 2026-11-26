/**
 * Commerce plane DTOs and resource types.
 *
 * The commerce plane has its own schema. It shares tenantId and territoryId
 * with the control plane but does not foreign-key into franchise tables.
 */

import type { Decimal } from "@prisma/client"

/** Money is always stored and transferred as minor units (cents). */
export type MinorUnits = number

export interface ProductView {
  id: string
  tenantId: string
  sku: string
  name: string
  description?: string | null
  basePriceMinor: MinorUnits
  currency: string
  active: boolean
  availableInTerritory: boolean
}

export interface VariantView {
  id: string
  productId: string
  optionsJson: Record<string, unknown>
  priceDeltaMinor: MinorUnits
}

export interface CartLineView {
  id: string
  variantId: string
  qty: number
  unitPriceMinor: MinorUnits
}

export interface CartView {
  id: string
  clientOpId: string
  tenantId: string
  territoryId: string
  status: "open" | "checked_out" | "abandoned"
  lines: CartLineView[]
  totalMinor: MinorUnits
}

export interface OrderView {
  id: string
  clientOpId: string
  tenantId: string
  territoryId: string
  franchiseId: string
  status:
    | "pending"
    | "paid"
    | "fulfilled"
    | "refunded"
    | "cancelled"
  totalMinor: MinorUnits
  currency: string
  customerId?: string | null
  createdAt: Date
}

export interface PriceOverride {
  productId: string
  territoryId: string
  priceMinor: MinorUnits
  floorMinor: MinorUnits
  ceilingMinor: MinorUnits
}

export interface PriceCheckResult {
  allowed: boolean
  priceMinor: MinorUnits
  reason?: string
}

export interface ResolvedTenant {
  tenantId: string
  territoryId: string
  franchiseId: string
  slug: string
  currency: string
}
