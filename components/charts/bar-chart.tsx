import { ChartContainer } from "./chart-container"

export type BarChartDatum = { label: string; value: number; color?: string }

export function BarChart({ data, title, valueFormatter = (value) => String(value), className }: { data: readonly BarChartDatum[]; title?: string; valueFormatter?: (value: number) => string; className?: string }) {
  const max = Math.max(...data.map((item) => item.value), 1)
  return <ChartContainer className={className} title={title}>
    <div className="flex h-52 items-end gap-2 sm:gap-4" role="img" aria-label={title ?? "Bar chart"}>
      {data.map((item) => <div className="flex min-w-0 flex-1 flex-col items-center gap-2" key={item.label}>
        <span className="max-w-full truncate text-[10px] text-muted-foreground" title={valueFormatter(item.value)}>{valueFormatter(item.value)}</span>
        <div className="flex h-36 w-full items-end"><div className="w-full rounded-t-lg bg-primary transition-[height]" style={{ height: `${Math.max((item.value / max) * 100, 3)}%`, backgroundColor: item.color }} /></div>
        <span className="max-w-full truncate text-xs text-muted-foreground">{item.label}</span>
      </div>)}
    </div>
  </ChartContainer>
}
