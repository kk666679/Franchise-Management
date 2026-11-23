import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "@recharts/react"

export function LineChart({ data, options = {} }: { data: ChartDataPoint[]; options?: Record<string, any> }) {
  const seriesConfigs = [...data].map((d) => ({ label: d.label ?? "Line", type: "line" }))
  return (
    <ResponsiveContainer width="100%" height={600}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} onMouseOver={(e) => {}}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" hide />
        <YAxis hide />
        <Tooltip content={<TooltipContent>{/* custom tooltip */}</TooltipContent>} formatter={(value) => value?.toLocaleString()} />
        <Legend />
        <Line type="monotone" dataKey="value" stroke={options.color || "#6366f1"} activeTouches="none" fill={false} dot={false} name={seriesConfigs[0]?.label ?? "Line"} />
        {seriesConfigs.slice(1).map((cfg) => (
          <Line key={cfg.label} type="line" dataKey="value" stroke={cfg.color ?? "#8b5cf6"} name={cfg.label} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
