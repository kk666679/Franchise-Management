import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  getIdempotentResponse,
  setIdempotentResponse,
} from "@/lib/server/commerce/idempotency/store"
import { withIdempotency } from "@/lib/server/commerce/idempotency/middleware"

vi.mock("@/lib/prisma", () => ({
  prisma: {
    idempotencyKey: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  },
}))

import { prisma } from "@/lib/prisma"

const mockedFindUnique = prisma.idempotencyKey.findUnique as ReturnType<
  typeof vi.fn
>
const mockedUpsert = prisma.idempotencyKey.upsert as ReturnType<typeof vi.fn>

describe("idempotency store", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("returns null when key has not been used", async () => {
    mockedFindUnique.mockResolvedValue(null)

    const result = await getIdempotentResponse("new-key")
    expect(result).toBeNull()
  })

  it("returns stored response for an existing unexpired key", async () => {
    mockedFindUnique.mockResolvedValue({
      responseJson: JSON.stringify({ orderId: "o_1" }),
      expiresAt: new Date(Date.now() + 100000),
    })

    const result = await getIdempotentResponse("used-key")
    expect(result).toBe(JSON.stringify({ orderId: "o_1" }))
  })

  it("returns null for an expired key", async () => {
    mockedFindUnique.mockResolvedValue({
      responseJson: JSON.stringify({ orderId: "o_1" }),
      expiresAt: new Date(Date.now() - 10000),
    })

    const result = await getIdempotentResponse("expired-key")
    expect(result).toBeNull()
  })

  it("upserts a response with expiry", async () => {
    mockedUpsert.mockResolvedValue({})

    await setIdempotentResponse("k", JSON.stringify({ ok: true }), 60)

    expect(mockedUpsert).toHaveBeenCalledWith({
      where: { key: "k" },
      update: { responseJson: JSON.stringify({ ok: true }), expiresAt: expect.any(Date) },
      create: { key: "k", responseJson: JSON.stringify({ ok: true }), expiresAt: expect.any(Date) },
    })
  })
})

describe("withIdempotency middleware", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("executes and stores result on first call", async () => {
    mockedFindUnique.mockResolvedValue(null)
    mockedUpsert.mockResolvedValue({})

    const action = vi.fn().mockResolvedValue({ orderId: "o_1" })

    const result = await withIdempotency({ key: "k1" }, action)

    expect(result).toEqual({ orderId: "o_1" })
    expect(action).toHaveBeenCalledTimes(1)
    expect(mockedUpsert).toHaveBeenCalledTimes(1)
  })

  it("returns prior result on duplicate key without re-executing", async () => {
    mockedFindUnique.mockResolvedValue({
      responseJson: JSON.stringify({ orderId: "o_prior" }),
      expiresAt: new Date(Date.now() + 100000),
    })

    const action = vi.fn().mockResolvedValue({ orderId: "o_new" })

    const result = await withIdempotency({ key: "k2" }, action)

    expect(result).toEqual({ orderId: "o_prior" })
    expect(action).not.toHaveBeenCalled()
  })
})
