"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { cn } from "@/lib/utils"

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
]

export type ChartWidgetPoint = {
  label: string
  value: number
  color?: string
  [key: string]: string | number | undefined
}

export interface ChartWidgetProps {
  data: ChartWidgetPoint[]
  type?: "line" | "bar" | "area" | "donut"
  series?: { key: string; label: string; color?: string }[]
  xKey?: string
  height?: number
  className?: string
  valueFormatter?: (value: number) => string
  showGrid?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
}

function defaultFormat(value: number) {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1)}k`
  return String(value)
}

function ChartTooltipContent({
  active,
  payload,
  label,
  valueFormatter,
}: {
  active?: boolean
  payload?: Array<{ name?: string; value?: number; color?: string; dataKey?: string }>
  label?: string
  valueFormatter: (value: number) => string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-border/60 bg-popover/95 px-3 py-2 text-xs shadow-lg backdrop-blur-sm">
      {label ? <p className="mb-1 font-medium text-foreground">{label}</p> : null}
      <div className="space-y-0.5">
        {payload.map((p, i) => (
          <div key={`${p.dataKey}-${i}`} className="flex items-center gap-2 text-muted-foreground">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: p.color ?? CHART_COLORS[i % CHART_COLORS.length] }}
            />
            <span>{p.name ?? p.dataKey}:</span>
            <span className="font-medium tabular-nums text-foreground">
              {typeof p.value === "number" ? valueFormatter(p.value) : p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ChartWidget({
  data,
  type = "line",
  series,
  xKey = "label",
  height = 260,
  className,
  valueFormatter = defaultFormat,
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
}: ChartWidgetProps) {
  const seriesConfig =
    series && series.length > 0
      ? series
      : [{ key: "value", label: "Value", color: CHART_COLORS[0] }]

  if (type === "donut") {
    const total = data.reduce((sum, d) => sum + (Number(d.value) || 0), 0)
    return (
      <div className={cn("relative", className)} style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius="62%"
              outerRadius="82%"
              paddingAngle={3}
              stroke="transparent"
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.label}
                  fill={entry.color ?? CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltipContent valueFormatter={valueFormatter} />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold tabular-nums text-foreground">
            {valueFormatter(total)}
          </span>
          <span className="text-xs text-muted-foreground">Total</span>
        </div>
      </div>
    )
  }

  const commonAxis = {
    axisLine: false,
    tickLine: false,
    tick: { fill: "var(--color-muted-foreground)", fontSize: 12 },
  }

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {type === "bar" ? (
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            {showGrid ? <CartesianGrid vertical={false} stroke="var(--color-border)" strokeOpacity={0.5} /> : null}
            {showXAxis ? <XAxis dataKey={xKey} {...commonAxis} dy={8} /> : null}
            {showYAxis ? <YAxis {...commonAxis} tickFormatter={valueFormatter} width={48} /> : null}
            <Tooltip
              cursor={{ fill: "var(--color-muted)", opacity: 0.3 }}
              content={<ChartTooltipContent valueFormatter={valueFormatter} />}
            />
            {seriesConfig.map((s, i) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.label}
                fill={s.color ?? CHART_COLORS[i % CHART_COLORS.length]}
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
            ))}
          </BarChart>
        ) : (
          <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            {showGrid ? <CartesianGrid vertical={false} stroke="var(--color-border)" strokeOpacity={0.5} /> : null}
            {showXAxis ? <XAxis dataKey={xKey} {...commonAxis} dy={8} /> : null}
            {showYAxis ? <YAxis {...commonAxis} tickFormatter={valueFormatter} width={48} /> : null}
            <Tooltip content={<ChartTooltipContent valueFormatter={valueFormatter} />} />
            {seriesConfig.map((s, i) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color ?? CHART_COLORS[i % CHART_COLORS.length]}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: s.color ?? CHART_COLORS[i % CHART_COLORS.length] }}
                fill={type === "area" ? s.color ?? CHART_COLORS[i % CHART_COLORS.length] : undefined}
                fillOpacity={type === "area" ? 0.12 : undefined}
              />
            ))}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
