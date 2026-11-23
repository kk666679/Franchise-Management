import type { ChartDataPoint } from "../types"

export function ProfitLossChart({ data }: { data: ChartDataPoint[]; options?: Record<string, unknown> }) {
  return <div data-chart="profit-loss">{data.length} points</div>
}

