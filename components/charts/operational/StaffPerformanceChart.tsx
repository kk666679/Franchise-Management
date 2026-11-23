import { StaffPerformanceChart } from "./StaffPerformanceChart"

export function StaffPerformanceChart({ data, options = {} }: { data: ChartDataPoint[]; options?: Record<string, any> }) {
  return (
    <StaffPerformanceChart data={data} options={options} />
  )
}
