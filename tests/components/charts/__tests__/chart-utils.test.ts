import { describe, it, expect } from "vitest"
import { formatCurrency, formatPercentage, formatNumber, formatDate } from "../types"

describe("chart-utils", () => {
  it("formats currency", () => {
    expect(formatCurrency(1234.56)).toContain("$1,234.56")
  })
  it("formats percentage", () => {
    expect(formatPercentage(0.75)).toBe("75%")
  })
  it("formats number", () => {
    expect(formatNumber(3.14159)).toBe("3.14")
  })
  it("formats date", () => {
    expect(formatDate("2026-11-23")).toBe("2026-11-23")
  })
})
