import { describe, it, expect } from "vitest"
import { RevenueChart } from "@/components/charts/financial/RevenueChart"
import { ProfitLossChart } from "@/components/charts/financial/ProfitLossChart"
import { CashFlowChart } from "@/components/charts/financial/CashFlowChart"
import { SalesTrendChart } from "@/components/charts/financial/SalesTrendChart"
import { ExpenseBreakdownChart } from "@/components/charts/financial/ExpenseBreakdownChart"
import { RevenueComparisonChart } from "@/components/charts/financial/RevenueComparisonChart"

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
