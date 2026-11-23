import type { ChartDataPoint } from "../types"

export function CashFlowChart({ data }: { data: ChartDataPoint[]; options?: Record<string, unknown> }) {
  return <div data-chart="cash-flow">{data.length} points</div>
}

