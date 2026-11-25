import { describe, expect, it } from "vitest"

import { toContractStatus } from "@/components/domain/franchise/mappers"
import { toInvoiceStatus } from "@/components/domain/finance/mappers"

describe("domain status mappers", () => {
  it("preserves persisted partial-payment status", () => {
    expect(toInvoiceStatus("PARTIALLY_PAID")).toBe("partially_paid")
  })

  it("maps persisted agreement statuses to lifecycle badges", () => {
    expect(toContractStatus("PENDING_SIGNATURE")).toBe("pending_approval")
    expect(toContractStatus("EXPIRED")).toBe("expired")
  })

  it("rejects unknown persisted statuses instead of displaying an invalid badge", () => {
    expect(() => toContractStatus("UNKNOWN")).toThrow(
      "Unsupported contract status: UNKNOWN"
    )
  })
})
