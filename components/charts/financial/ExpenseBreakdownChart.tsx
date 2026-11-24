import type { ChartDataPoint } from "../types"

export function ExpenseBreakdownChart({
  data,
}: {
  data: ChartDataPoint[]
  options?: Record<string, unknown>
}) {
  return <div data-chart="expense-breakdown">{data.length} points</div>
}
