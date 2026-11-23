import { ExpenseBreakdownChart } from "./ExpenseBreakdownChart"

export function ExpenseBreakdownChart({ data, options = {} }: { data: ChartDataPoint[]; options?: Record<string, any> }) {
  return (
    <ExpenseBreakdownChart data={data} options={options} />
  )
}
