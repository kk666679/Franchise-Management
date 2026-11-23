import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "@recharts/react"

export function PieChart({ data, options = {} }: { data: ChartDataPoint[]; options?: Record<string, any> }) {
  return (
    <ResponsiveContainer width="100%" height={600}>
      <PieChart data={data} cx="50%" cy="50%" outerRadius={80} innerRadius={20} paddingAngle={2} onMouseOver={(e) => {}}>
        <Pie dataKey="value" data={data} cx="50%" cy="50%" labelLine={3} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
