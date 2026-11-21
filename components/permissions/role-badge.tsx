import { ShieldCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { getRoleDefinition, type RoleCode } from "@/lib/rbac"

export function RoleBadge({ role, showIcon = true }: { role: RoleCode; showIcon?: boolean }) {
  const definition = getRoleDefinition(role)
  return <Badge aria-label={`Role: ${definition.name}`} variant="secondary">
    {showIcon ? <ShieldCheck aria-hidden="true" /> : null}
    {definition.name}
  </Badge>
}
