'use client'

import Link from 'next/link'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data/DataTableColumnHeader'
import { FormattedDate } from '@/components/common/FormattedDate'
import { FranchiseStatusBadge } from '../FranchiseStatusBadge'
import type { FranchiseView } from '../mappers'

export const franchiseColumns: ColumnDef<any, FranchiseView>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Franchise" />,
    cell: ({ row }) => (
      <Link
        href={`/franchises/${row.original.id}`}
        className="font-medium underline-offset-4 hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: 'organizationName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Organization" />,
  },
  {
    accessorKey: 'territoryName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Territory" />,
    cell: ({ row }) => row.original.territoryName ?? <span className="text-muted">—</span>,
  },
  {
    accessorKey: 'branchCount',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Branches" />,
    cell: ({ row }) => <span className="tabular-nums">{row.original.branchCount}</span>,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <FranchiseStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'createdAtIso',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => <FormattedDate iso={row.original.createdAtIso} />,
  },
]
