export interface ChartLegendProps {
  items?: { label: string; color: string }[]
  position?: "top" | "right" | "bottom" | "left"
}

export function ChartLegend({ items = [] }: ChartLegendProps) {
  return (
    <ul className="mb-2 flex items-center gap-3">
      {items.length === 0 ? <li className="text-muted-foreground">No entries</li> : null}
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2">
          <span className="inline-block size-2 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="text-xs font-medium">{item.label}</span>
        </li>
      ))}
    </ul>
  )
}
