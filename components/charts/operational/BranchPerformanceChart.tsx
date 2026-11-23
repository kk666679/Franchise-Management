import type { ChartDataPoint } from "../types"

export function BranchPerformanceChart({ data, options = {} }: { data: ChartDataPoint[]; options?: Record<string, any> }) {
  return (
    <BranchPerformanceChart data={data} options={options} />
  )
}


