import type { ChartDataPoint } from "../types"

export function InventoryMovementChart({
  data,
  options = {},
}: {
  data: ChartDataPoint[]
  options?: Record<string, any>
}) {
  return <InventoryMovementChart data={data} options={options} />
}
