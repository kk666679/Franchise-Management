import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "@recharts/react"

export function BarChart({ data, options = {} }: { data: ChartDataPoint[]; options?: Record<string, any> }) {
  return (
    <ResponsiveContainer width="100%" height={600}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} onMouseOver={(e) => {}}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis hide />
        <YAxis hide />
        <Tooltip content={<TooltipContent/>} formatter={(v) => v?.toLocaleString()} />
        <Legend />
        {data.map((d, idx) => (
          <Bar key={idx} type="monotone" dataKey="value" fill={options.color?.[idx] ?? "#6366f1"} name={`${idx + 1}`} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
