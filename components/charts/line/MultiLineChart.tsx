import { MultiLineChart, MultiSeries, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "@recharts/react"

export function MultiLineChart({ data, options = {} }: { data: ChartDataPoint[]; options?: Record<string, any> }) {
  return (
    <ResponsiveContainer width="100%" height={600}>
      <MultiLineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} onMouseOver={(e) => {}}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" hide />
        <YAxis hide />
        <Tooltip content={<TooltipContent/>} formatter={(v) => v?.toLocaleString()} />
        <Legend />
        {data.map((row, idx) => (
          <Line key={idx} type="line" dataKey="value" stroke={`hsl(${idx * 60}, 70%, 50%)`} name={`Line ${idx}`} />
        ))}
      </MultiLineChart>
    </ResponsiveContainer>
  )
}
