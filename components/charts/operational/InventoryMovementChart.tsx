import { InventoryMovementChart } from "./InventoryMovementChart"

export function InventoryMovementChart({ data, options = {} }: { data: ChartDataPoint[]; options?: Record<string, any> }) {
  return (
    <InventoryMovementChart data={data} options={options} />
  )
}
