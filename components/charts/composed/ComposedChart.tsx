import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "@recharts/react"

export function ComposedChart({ data, options = {} }: { data: ChartDataPoint[]; options?: Record<string, any> }) {
  return (
    <ResponsiveContainer width="100%" height={600}>
      <ComposedChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} onMouseOver={(e) => {}}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis hide />
        <YAxis hide />
        <Tooltip content={<TooltipContent/>} formatter={(v) => v?.toLocaleString()} />
        <Legend />
        {data.map((row, idx) => (
          <Line key={idx} type="line" dataKey="value" stroke={`hsl(${idx * 60}, 70%, 50%)`} name={`Combo ${idx + 1}`} />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  )
}
