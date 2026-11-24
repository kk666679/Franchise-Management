import type { ChartDataPoint } from "../types"

export function SalesTrendChart({
  data,
}: {
  data: ChartDataPoint[]
  options?: Record<string, unknown>
}) {
  return <div data-chart="sales-trend">{data.length} points</div>
}
