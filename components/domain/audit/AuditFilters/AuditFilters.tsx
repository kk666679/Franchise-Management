"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { AuditFiltersProps } from "./AuditFilters.types"

export function AuditFilters({ value, onChange }: AuditFiltersProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="space-y-1.5">
        <Label htmlFor="audit-actor">Actor</Label>
        <Input
          id="audit-actor"
          value={value.actor ?? ""}
          onChange={(e) => onChange({ ...value, actor: e.target.value })}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="audit-action">Action</Label>
        <Input
          id="audit-action"
          value={value.action ?? ""}
          onChange={(e) => onChange({ ...value, action: e.target.value })}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="audit-entity">Entity type</Label>
        <Input
          id="audit-entity"
          value={value.entityType ?? ""}
          onChange={(e) => onChange({ ...value, entityType: e.target.value })}
        />
      </div>
    </div>
  )
}
