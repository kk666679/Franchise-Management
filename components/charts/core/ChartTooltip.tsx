export interface ChartTooltipProps {
  content?: unknown
  formatter?: (value: unknown) => string
}

export function ChartTooltip({ content, formatter }: ChartTooltipProps) {
  if (content == null) return null
  const value = formatter ? formatter(content) : String(content)
  return (
    <div className="rounded border bg-background px-2 py-1 text-xs shadow-sm">
      {value}
    </div>
  )
}
