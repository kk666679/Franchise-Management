import { SalesTrendChart } from "./SalesTrendChart"

export function SalesTrendChart({ data, options = {} }: { data: ChartDataPoint[]; options?: Record<string, any> }) {
  return (
    <SalesTrendChart data={data} options={options} />
  )
}
