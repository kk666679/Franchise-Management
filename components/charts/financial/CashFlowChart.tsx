import { CashFlowChart } from "./CashFlowChart"

export function CashFlowChart({ data, options = {} }: { data: ChartDataPoint[]; options?: Record<string, any> }) {
  return (
    <CashFlowChart data={data} options={options} />
  )
}
