'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data/DataTableColumnHeader'
import { TerritoryConflictBadge } from '../TerritoryConflictBadge'
import type { TerritoryView } from '../mappers'

export const territoryColumns: ColumnDef<any, TerritoryView>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Territory" />,
  },
  {
    accessorKey: 'region',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Region" />,
  },
  {
    accessorKey: 'franchiseName',
    header: 'Assigned to',
    cell: ({ row }) => row.original.franchiseName ?? <span className="text-muted">Unassigned</span>,
  },
  {
    id: 'conflict',
    header: 'Conflict',
    cell: ({ row }) =>
      row.original.hasConflict ? <TerritoryConflictBadge /> : <span className="text-muted">—</span>,
  },
]
