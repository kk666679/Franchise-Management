import { TooltipContent, TooltipStyle } from "recharts"

export function ChartTooltip({ content, formatter }: ChartTooltipProps) {
  if (!content || !formatter) {
    return null
  }
  return (
    <TooltipContent style={TooltipStyle}>
      {formatter(content.value ?? content)}
    </TooltipContent>
  )
}
