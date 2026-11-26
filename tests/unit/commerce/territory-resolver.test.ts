import { describe, it, expect, vi, beforeEach } from "vitest"
import { resolveTenant } from "@/lib/server/commerce/tenant/resolver"

vi.mock("@/lib/prisma", () => ({
  prisma: {
    commerceTenant: {
      findUnique: vi.fn(),
    },
  },
}))

import { prisma } from "@/lib/prisma"

const mockedFindUnique = prisma.commerceTenant.findUnique as ReturnType<
  typeof vi.fn
>

describe("territory resolver", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("resolves tenant slug to tenant + territory context", async () => {
    mockedFindUnique.mockResolvedValue({
      id: "tenant_1",
      slug: "acme",
      currency: "USD",
      franchiseeOrgId: "org_1",
      territories: [{ id: "terr_1", franchiseId: "fran_1" }],
    })

    const ctx = await resolveTenant("acme")

    expect(ctx).toEqual({
      tenantId: "tenant_1",
      territoryId: "terr_1",
      franchiseId: "fran_1",
      slug: "acme",
      currency: "USD",
    })
    expect(mockedFindUnique).toHaveBeenCalledWith({
      where: { slug: "acme" },
      select: {
        id: true,
        slug: true,
        currency: true,
        franchiseeOrgId: true,
        territories: {
          where: { active: true },
          take: 1,
          select: { id: true, franchiseId: true },
        },
      },
    })
  })

  it("throws when tenant is unknown", async () => {
    mockedFindUnique.mockResolvedValue(null)

    await expect(resolveTenant("nope")).rejects.toThrow("COMMERCE_NOT_FOUND")
  })

  it("throws when tenant has no active territory", async () => {
    mockedFindUnique.mockResolvedValue({
      id: "tenant_1",
      slug: "acme",
      currency: "USD",
      franchiseeOrgId: "org_1",
      territories: [],
    })

    await expect(resolveTenant("acme")).rejects.toThrow("COMMERCE_NOT_FOUND")
  })
})
