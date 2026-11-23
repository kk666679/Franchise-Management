import { describe, it, expect } from "vitest"
import { primaryColors, secondaryColors } from "../chart-colors"

describe("chart-colors", () => {
  it("primary colors defined", () => {
    expect(primaryColors.length).toBe(5)
  })
  it("secondary colors defined", () => {
    expect(secondaryColors.length).toBe(5)
  })
})
