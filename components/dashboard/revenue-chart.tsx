"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type RevenueChartProps = {
  values: Array<{ label: string; value: number }>
  currency: string
}

const compact = (v: number) =>
  new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(v)

export function RevenueChart({ values, currency }: RevenueChartProps) {
  const total = values.reduce((s, v) => s + v.value, 0)
  const currencyFmt = new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  })

  return (
    <section
      className="glass min-w-0 rounded-2xl p-5 sm:p-6"
      aria-labelledby="revenue-title"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Revenue activity</p>
          <h2 id="revenue-title" className="mt-1 text-lg font-semibold">
            Last 7 days
          </h2>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">{currency} total</p>
          <p className="mt-0.5 text-lg font-semibold tabular-nums">
            {currencyFmt.format(total)}
          </p>
        </div>
      </div>

      <div className="mt-6 h-44">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={values} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={compact}
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-popover)",
                border: "1px solid var(--color-border)",
                borderRadius: "0.75rem",
                fontSize: 12,
                color: "var(--color-foreground)",
              }}
              formatter={(v) => [
                typeof v === "number" ? currencyFmt.format(v) : v,
                "Revenue",
              ]}
              cursor={{ stroke: "var(--color-border)" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fill="url(#revenueGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "var(--color-primary)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <table className="sr-only">
        <caption>Daily revenue for the last 7 days</caption>
        <thead><tr><th scope="col">Day</th><th scope="col">Revenue</th></tr></thead>
        <tbody>
          {values.map((value) => (
            <tr key={value.label}>
              <th scope="row">{value.label}</th>
              <td>{currencyFmt.format(value.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
