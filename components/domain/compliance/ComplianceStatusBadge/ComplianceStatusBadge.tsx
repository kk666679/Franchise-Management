import { Badge } from "@/components/ui/badge"
import type { ComplianceStatusBadgeProps } from "./ComplianceStatusBadge.types"

const map: Record<
  ComplianceStatusBadgeProps["status"],
  {
    label: string
    variant: "default" | "secondary" | "destructive" | "outline"
  }
> = {
  compliant: { label: "Compliant", variant: "default" },
  pending: { label: "Pending", variant: "secondary" },
  overdue: { label: "Overdue", variant: "destructive" },
  waived: { label: "Waived", variant: "outline" },
}

export function ComplianceStatusBadge({ status }: ComplianceStatusBadgeProps) {
  const { label, variant } = map[status]
  return (
    <Badge variant={variant} aria-label={`Compliance status: ${label}`}>
      {label}
    </Badge>
  )
}
