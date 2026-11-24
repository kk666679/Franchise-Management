"use client"

import type { ChartDataPoint } from "../types"

export function MultiLineChart({
  data,
}: {
  data: ChartDataPoint[]
  options?: Record<string, unknown>
}) {
  return <div data-chart="multi-line">{data.length} points</div>
}
