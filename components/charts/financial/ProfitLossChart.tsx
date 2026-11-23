import { ProfitLossChart } from "./ProfitLossChart"

export function ProfitLossChart({ data, options = {} }: { data: ChartDataPoint[]; options?: Record<string, any> }) {
  return (
    <ProfitLossChart data={data} options={options} />
  )
}
