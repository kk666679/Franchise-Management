import { LegendItem } from "./types"

export function ChartLegend({ items = [], position = "right" }: ChartLegendProps) {
  const itemsMap = items.map((item) => ({ label: item.label, color: item.color }))
  return (
    <ul className="flex items-center gap-3 mb-2">
      {itemsMap.length === 0 && <li className="text-muted-foreground">No entries</li>}
      {itemsMap.map((item) => (
        <li key={item.label} className="flex items-center gap-2">
          <span className="text-xs font-medium">{item.label}</span>
          <span className="text-xs text-muted-foreground">{item.color}</span>
        </li>
      ))}
    </ul>
  )
}
