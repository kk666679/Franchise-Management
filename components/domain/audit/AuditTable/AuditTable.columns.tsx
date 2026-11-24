"use client"

import { Badge } from "@/components/ui/badge"
import type { AuditEventView } from "../mappers"

export const auditColumns = [
  {
    accessorKey: "occurredAtIso",
    header: "When",
    sortable: true,
    cell: (row: AuditEventView) => (
      <span className="text-xs whitespace-nowrap text-muted-foreground tabular-nums">
        {new Date(row.occurredAtIso).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "actorName",
    header: "Actor",
    sortable: true,
  },
  {
    accessorKey: "action",
    header: "Action",
    sortable: true,
    cell: (row: AuditEventView) => <Badge variant="secondary" className="text-xs">{row.action}</Badge>,
  },
  {
    accessorKey: "entityType",
    header: "Entity",
    sortable: true,
  },
  {
    accessorKey: "entityId",
    header: "Entity ID",
    sortable: false,
    cell: (row: AuditEventView) => (
      <span className="font-mono text-xs text-muted-foreground">{row.entityId.slice(0, 12)}</span>
    ),
  },
  {
    accessorKey: "summary",
    header: "Summary",
    sortable: false,
    cell: (row: AuditEventView) => <span className="text-muted-foreground">{row.summary}</span>,
  },
]

