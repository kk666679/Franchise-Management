import { describe, it, expect } from "vitest"
import { RevenueChart } from "./financial/RevenueChart"
import { ProfitLossChart } from "./financial/ProfitLossChart"
import { CashFlowChart } from "./financial/CashFlowChart"
import { SalesTrendChart } from "./financial/SalesTrendChart"
import { ExpenseBreakdownChart } from "./financial/ExpenseBreakdownChart"
import { RevenueComparisonChart } from "./financial/RevenueComparisonChart"

describe("Charts", () => {
  it("exports charts", () => {
    expect(RevenueChart).toBeDefined()
    expect(ProfitLossChart).toBeDefined()
    expect(CashFlowChart).toBeDefined()
    expect(SalesTrendChart).toBeDefined()
    expect(ExpenseBreakdownChart).toBeDefined()
    expect(RevenueComparisonChart).toBeDefined()
  })
})
