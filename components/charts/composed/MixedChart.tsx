import type { ChartDataPoint } from "../types"

export function MixedChart({
  data,
}: {
  data: ChartDataPoint[]
  options?: Record<string, unknown>
}) {
  return <div data-chart="mixed">{data.length} points</div>
}
