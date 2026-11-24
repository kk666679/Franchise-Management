"use client"

import type { ChartDataPoint } from "../types"

export function MultiAreaChart({
  data,
}: {
  data: ChartDataPoint[]
  options?: Record<string, unknown>
}) {
  return <div data-chart="multi-area">{data.length} points</div>
}
