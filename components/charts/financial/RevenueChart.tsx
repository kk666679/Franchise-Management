import type { ChartDataPoint } from "../types"

export function RevenueChart({
  data,
}: {
  data: ChartDataPoint[]
  options?: Record<string, unknown>
}) {
  return <div data-chart="revenue">{data.length} points</div>
}
