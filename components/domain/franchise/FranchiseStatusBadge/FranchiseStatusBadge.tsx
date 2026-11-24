import { Badge } from "@/components/ui/badge"
import type { FranchiseStatusBadgeStatus } from "./FranchiseStatusBadge.types"

const label: Record<string, string> = {
  draft: "Draft",
  active: "Active",
  suspended: "Suspended",
  terminated: "Terminated",
  DRAFT: "Draft",
  ACTIVE: "Active",
  SUSPENDED: "Suspended",
  TERMINATED: "Terminated",
  PROSPECT: "Prospect",
  ON_HOLD: "On hold",
  EXITED: "Exited",
}

const tone: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  draft: "outline",
  active: "default",
  suspended: "secondary",
  terminated: "destructive",
  DRAFT: "outline",
  ACTIVE: "default",
  SUSPENDED: "secondary",
  TERMINATED: "destructive",
  PROSPECT: "secondary",
  ON_HOLD: "outline",
  EXITED: "destructive",
}

export function FranchiseStatusBadge({
  status,
}: {
  status: FranchiseStatusBadgeStatus
}) {
  const key = String(status)
  const display = label[key] ?? key
  const variant = tone[key] ?? "outline"
  return (
    <Badge variant={variant} aria-label={`Franchise status: ${display}`}>
      {display}
    </Badge>
  )
}
