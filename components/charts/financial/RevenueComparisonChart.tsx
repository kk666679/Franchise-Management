import { RevenueComparisonChart } from "./RevenueComparisonChart"

export function RevenueComparisonChart({ data, options = {} }: { data: ChartDataPoint[]; options?: Record<string, any> }) {
  return (
    <RevenueComparisonChart data={data} options={options} />
  )
}
