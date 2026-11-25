import { Badge } from "@/components/ui/badge"
import type { PosEdgeSignalView } from "../types"

export type EdgeSignalBadgeProps = {
  signal: PosEdgeSignalView
}

const variant: Record<PosEdgeSignalView["severity"], "default" | "secondary" | "destructive" | "outline"> = {
  info: "secondary",
  warning: "outline",
  critical: "destructive",
}

export function EdgeSignalBadge({ signal }: EdgeSignalBadgeProps) {
  return (
    <Badge variant={variant[signal.severity]} aria-label={`${signal.kind} signal: ${signal.severity}`}>
      {signal.kind}: {signal.message}
    </Badge>
  )
}
