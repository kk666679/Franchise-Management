import { StackedBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "@recharts/react"

export function StackedBarChart({ data, options = {} }: { data: ChartDataPoint[]; options?: Record<string, any> }) {
  return (
    <ResponsiveContainer width="100%" height={600}>
      <StackedBarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} onMouseOver={(e) => {}}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis hide />
        <YAxis hide />
        <Tooltip content={<TooltipContent/>} formatter={(v) => v?.toLocaleString()} />
        <Legend />
        {data.map((row, idx) => (
          <StackedBar key={idx} type="area" dataKey="value" stackWidth={options.stack ? 2 : 1} fill={options.color?.[idx] ?? "#6366f1"} name={`Stack ${idx + 1}`} />
        ))}
      </StackedBarChart>
    </ResponsiveContainer>
  )
}
