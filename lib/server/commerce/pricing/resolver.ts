/**
 * Price resolver — base price -> franchisee price per territory.
 *
 * Returns the effective price for a variant in a territory, honoring
 * franchisee price overrides when present.
 */
import { prisma } from "@/lib/prisma"
import type { MinorUnits } from "../types"

interface ResolvePriceInput {
  variantId: string
  territoryId: string
}

export async function resolvePrice(input: ResolvePriceInput): Promise<{
  priceMinor: MinorUnits
  floorMinor: MinorUnits
  ceilingMinor: MinorUnits
  overridden: boolean
}> {
  const { variantId, territoryId } = input

  const override = await prisma.franchiseePrice.findFirst({
    where: { variantId, territoryId },
    select: {
      priceMinor: true,
      floorMinor: true,
      ceilingMinor: true,
    },
  })

  if (override) {
    return {
      priceMinor: override.priceMinor,
      floorMinor: override.floorMinor,
      ceilingMinor: override.ceilingMinor,
      overridden: true,
    }
  }

  // Fall back to variant base price; no deviation allowed (floor == ceiling == base).
  const variant = await prisma.variant.findUnique({
    where: { id: variantId },
    select: { priceDeltaMinor: true },
  })

  const base = variant?.priceDeltaMinor ?? 0
  return {
    priceMinor: base,
    floorMinor: base,
    ceilingMinor: base,
    overridden: false,
  }
}
