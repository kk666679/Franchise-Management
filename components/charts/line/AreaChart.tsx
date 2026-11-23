import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "@recharts/react"

export function AreaChart({ data, options = {} }: { data: ChartDataPoint[]; options?: Record<string, any> }) {
  return (
    <ResponsiveContainer width="100%" height={600}>
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} onMouseOver={(e) => {}}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis hide />
        <YAxis hide />
        <Tooltip content={<TooltipContent/>} formatter={(v) => v?.toLocaleString()} />
        <Legend />
        <Area type="monotone" dataKey="value" stroke="#6366f1" fill true dot={false} name="Line" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
