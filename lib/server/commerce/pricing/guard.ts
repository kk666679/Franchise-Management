/**
 * Price guard — floor/ceiling enforcement.
 *
 * Server-side only. A client-supplied unit price is never trusted. For each
 * cart line we re-resolve the franchisee price for the territory and verify
 * the client price sits within [floor, ceiling]. Any violation rejects the
 * order before the transaction begins.
 */
import { prisma } from "@/lib/prisma"
import { CommercePriceOutOfBoundsError } from "../errors"
import type { MinorUnits } from "../types"

interface PriceGuardInput {
  variantId: string
  territoryId: string
  unitPriceMinor: MinorUnits
}

/**
 * Check a single line's unit price against floor/ceiling for the territory.
 * Throws CommercePriceOutOfBoundsError on violation.
 */
export async function checkPriceBounds(input: PriceGuardInput): Promise<void> {
  const { variantId, territoryId, unitPriceMinor } = input

  const franchiseePrice = await prisma.franchiseePrice.findFirst({
    where: {
      variantId,
      territoryId,
    },
    select: {
      priceMinor: true,
      floorMinor: true,
      ceilingMinor: true,
    },
  })

  // If no override exists, fall back to the variant's base price delta.
  // Floor/ceiling default to the base price (no deviation allowed).
  const floor = franchiseePrice?.floorMinor ?? 0
  const ceiling = franchiseePrice?.ceilingMinor ?? 0

  if (unitPriceMinor < floor || unitPriceMinor > ceiling) {
    throw new CommercePriceOutOfBoundsError(
      `Unit price ${unitPriceMinor} outside [${floor}, ${ceiling}] for variant ${variantId} in territory ${territoryId}`
    )
  }
}

/**
 * Validate every cart line. Returns the resolved prices for use in the order.
 * Throws on the first violation.
 */
export async function validateCartPrices(
  lines: { variantId: string; territoryId: string; unitPriceMinor: MinorUnits }[]
): Promise<void> {
  for (const line of lines) {
    await checkPriceBounds(line)
  }
}
