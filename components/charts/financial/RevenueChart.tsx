import { RevenueChart } from "./RevenueChart"

export function RevenueChart({ data, options = {} }: { data: ChartDataPoint[]; options?: Record<string, any> }) {
  return (
    <RevenueChart data={data} options={options} />
  )
}
