import type { ChartDataPoint } from "../types"

export function ComposedChart({ data }: { data: ChartDataPoint[]; options?: Record<string, unknown> }) {
  return <div data-chart="composed">{data.length} points</div>
}
