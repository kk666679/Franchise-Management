import { Badge } from "@/components/ui/badge"
import type { ContractStatus } from "./ContractLifecycleBadge.types"

const label: Record<ContractStatus, string> = {
  draft: "Draft",
  pending_approval: "Pending approval",
  pending_signature: "Pending signature",
  active: "Active",
  renewal: "Renewal",
  expired: "Expired",
  terminated: "Terminated",
}

const tone: Record<
  ContractStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  draft: "outline",
  pending_approval: "secondary",
  pending_signature: "secondary",
  active: "default",
  renewal: "secondary",
  expired: "outline",
  terminated: "destructive",
}

export function ContractLifecycleBadge({ status }: { status: ContractStatus }) {
  return (
    <Badge
      variant={tone[status]}
      aria-label={`Contract status: ${label[status]}`}
    >
      {label[status]}
    </Badge>
  )
}
