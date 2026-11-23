import { CustomerGrowthChart } from "./CustomerGrowthChart"

export function CustomerGrowthChart({ data, options = {} }: { data: ChartDataPoint[]; options?: Record<string, any> }) {
  return (
    <CustomerGrowthChart data={data} options={options} />
  )
}
