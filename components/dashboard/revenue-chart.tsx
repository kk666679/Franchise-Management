type RevenueChartProps = {
  values: Array<{ label: string; value: number }>
  currency: string
}

const money = new Intl.NumberFormat("en", { maximumFractionDigits: 0 })

export function RevenueChart({ values, currency }: RevenueChartProps) {
  const maximum = Math.max(...values.map((item) => item.value), 1)

  return (
    <section className="glass min-w-0 rounded-2xl p-5 sm:p-6" aria-labelledby="revenue-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Revenue activity</p>
          <h2 id="revenue-title" className="mt-1 text-lg font-semibold">Last 7 days</h2>
        </div>
        <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">{currency}</span>
      </div>
      <div className="mt-8 flex h-44 items-end gap-2 sm:gap-4" role="img" aria-label="Revenue activity for the last seven days">
        {values.map((item) => (
          <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <span className="max-w-full truncate text-[10px] text-muted-foreground" title={`${currency} ${money.format(item.value)}`}>
              {item.value > 0 ? money.format(item.value) : "—"}
            </span>
            <div className="flex h-28 w-full items-end rounded-lg bg-muted/50 p-1">
              <div
                className="w-full rounded-md bg-primary/80 transition-[height] duration-500"
                style={{ height: `${Math.max((item.value / maximum) * 100, item.value ? 8 : 2)}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
