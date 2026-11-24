"use client"

import { TerritoryConflictBadge } from "../TerritoryConflictBadge"
import type { TerritoryView } from "../mappers"

export const territoryColumns = [
  {
    accessorKey: "name",
    header: "Territory",
    sortable: true,
  },
  {
    accessorKey: "region",
    header: "Region",
    sortable: true,
  },
  {
    accessorKey: "franchiseName",
    header: "Assigned to",
    sortable: true,
    cell: (row: TerritoryView) =>
      row.franchiseName ?? <span className="text-muted">Unassigned</span>,
  },
  {
    accessorKey: "hasConflict",
    header: "Conflict",
    sortable: true,
    cell: (row: TerritoryView) =>
      row.hasConflict ? (
        <TerritoryConflictBadge />
      ) : (
        <span className="text-muted">—</span>
      ),
  },
]
