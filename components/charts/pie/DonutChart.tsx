import { DonutChart, Arc, Tooltip, Legend, ResponsiveContainer } from "@recharts/react"

export function DonutChart({ data, options = {} }: { data: ChartDataPoint[]; options?: Record<string, any> }) {
  return (
    <ResponsiveContainer width="100%" height={600}>
      <DonutChart data={data} cx="50%" cy="50%" outerRadius={80} innerRadius={20} paddingAngle={2} onMouseOver={(e) => {}}>
        <Tooltip content={<TooltipContent/>} formatter={(v) => v?.toLocaleString()} />
        <Legend />
      </DonutChart>
    </ResponsiveContainer>
  )
}
