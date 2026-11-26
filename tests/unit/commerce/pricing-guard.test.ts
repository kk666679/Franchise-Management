import { describe, it, expect, vi, beforeEach } from "vitest"
import { checkPriceBounds, validateCartPrices } from "@/lib/server/commerce/pricing/guard"

// Mock prisma so the guard is unit-tested without a database.
vi.mock("@/lib/prisma", () => ({
  prisma: {
    franchiseePrice: {
      findFirst: vi.fn(),
    },
    variant: {
      findUnique: vi.fn(),
    },
  },
}))

import { prisma } from "@/lib/prisma"

const mockedFindFirst = prisma.franchiseePrice.findFirst as ReturnType<
  typeof vi.fn
>
const mockedFindUnique = prisma.variant.findUnique as ReturnType<typeof vi.fn>

describe("pricing guard", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("allows a price within floor and ceiling", async () => {
    mockedFindFirst.mockResolvedValue({
      priceMinor: 1000,
      floorMinor: 800,
      ceilingMinor: 1200,
    })

    await expect(
      checkPriceBounds({
        variantId: "v_1",
        territoryId: "t_1",
        unitPriceMinor: 1000,
      })
    ).resolves.toBeUndefined()
  })

  it("rejects a price below floor", async () => {
    mockedFindFirst.mockResolvedValue({
      priceMinor: 1000,
      floorMinor: 800,
      ceilingMinor: 1200,
    })

    await expect(
      checkPriceBounds({
        variantId: "v_1",
        territoryId: "t_1",
        unitPriceMinor: 700,
      })
    ).rejects.toThrow("PRICE_OUT_OF_BOUNDS")
  })

  it("rejects a price above ceiling", async () => {
    mockedFindFirst.mockResolvedValue({
      priceMinor: 1000,
      floorMinor: 800,
      ceilingMinor: 1200,
    })

    await expect(
      checkPriceBounds({
        variantId: "v_1",
        territoryId: "t_1",
        unitPriceMinor: 1500,
      })
    ).rejects.toThrow("PRICE_OUT_OF_BOUNDS")
  })

  it("falls back to base price when no override exists", async () => {
    mockedFindFirst.mockResolvedValue(null)
    mockedFindUnique.mockResolvedValue({ priceDeltaMinor: 900 })

    // 900 is within [900, 900] (floor == ceiling == base)
    await expect(
      checkPriceBounds({
        variantId: "v_1",
        territoryId: "t_1",
        unitPriceMinor: 900,
      })
    ).resolves.toBeUndefined()

    // 950 violates [900, 900]
    await expect(
      checkPriceBounds({
        variantId: "v_1",
        territoryId: "t_1",
        unitPriceMinor: 950,
      })
    ).rejects.toThrow("PRICE_OUT_OF_BOUNDS")
  })

  it("validates all lines and throws on first violation", async () => {
    mockedFindFirst
      .mockResolvedValueOnce({ priceMinor: 1000, floorMinor: 800, ceilingMinor: 1200 })
      .mockResolvedValueOnce({ priceMinor: 500, floorMinor: 400, ceilingMinor: 600 })

    await expect(
      validateCartPrices([
        { variantId: "v_1", territoryId: "t_1", unitPriceMinor: 1000 },
        { variantId: "v_2", territoryId: "t_1", unitPriceMinor: 700 }, // above ceiling 600
      ])
    ).rejects.toThrow("PRICE_OUT_OF_BOUNDS")
  })
})
