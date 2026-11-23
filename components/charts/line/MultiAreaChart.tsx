import { MultiAreaChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "@recharts/react"

export function MultiAreaChart({ data, options = {} }: { data: ChartDataPoint[]; options?: Record<string, any> }) {
  const seriesCount = data.length
  return (
    <ResponsiveContainer width="100%" height={600}>
      <MultiAreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} onMouseOver={(e) => {}}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis hide />
        <YAxis hide />
        <Tooltip content={<TooltipContent/>} formatter={(v) => v?.toLocaleString()} />
        <Legend />
        {seriesCount > 1 ? (
          data.map((row, idx) => (
            <Line key={idx} type="line" dataKey="value" stroke={`hsl(${idx * 60}, 70%, 50%)`} name={`Area ${idx}`} />
          ))
        ) : (
          <Line type="line" dataKey="value" stroke="#6366f1" fill true name="Total" />
        )}
      </MultiAreaChart>
    </ResponsiveContainer>
  )
}
