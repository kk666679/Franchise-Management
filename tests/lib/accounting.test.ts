import { describe, expect, it } from "vitest"

import { validateJournalLines } from "@/lib/accounting-validation"

describe("validateJournalLines", () => {
  it("accepts balanced decimal lines", () => {
    const result = validateJournalLines([
      { accountId: "cash", debit: "125.10" },
      { accountId: "revenue", credit: "125.10" },
    ])

    expect(result.debits.toString()).toBe("125.1")
    expect(result.credits.toString()).toBe("125.1")
  })

  it("rejects unbalanced entries", () => {
    expect(() =>
      validateJournalLines([
        { accountId: "cash", debit: 100 },
        { accountId: "revenue", credit: 99.99 },
      ])
    ).toThrow("equal")
  })

  it("rejects a line containing both debit and credit", () => {
    expect(() =>
      validateJournalLines([
        { accountId: "cash", debit: 100, credit: 1 },
        { accountId: "revenue", credit: 99 },
      ])
    ).toThrow("both")
  })

  it("rejects negative and zero-value lines", () => {
    expect(() =>
      validateJournalLines([
        { accountId: "cash", debit: -1 },
        { accountId: "revenue", credit: -1 },
      ])
    ).toThrow("negative")

    expect(() =>
      validateJournalLines([
        { accountId: "cash" },
        { accountId: "revenue", credit: 1 },
      ])
    ).toThrow("debit or a credit")
  })
})
