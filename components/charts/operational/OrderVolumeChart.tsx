import type { ChartDataPoint } from "../types"

export function OrderVolumeChart({ data, options = {} }: { data: ChartDataPoint[]; options?: Record<string, any> }) {
  return (
    <OrderVolumeChart data={data} options={options} />
  )
}


