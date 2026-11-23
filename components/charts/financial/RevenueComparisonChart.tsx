import type { ChartDataPoint } from "../types"

export function RevenueComparisonChart({ data }: { data: ChartDataPoint[]; options?: Record<string, unknown> }) {
  return <div data-chart="revenue-comparison">{data.length} points</div>
}


