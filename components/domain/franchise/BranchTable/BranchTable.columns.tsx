'use client'

import Link from 'next/link'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data/DataTableColumnHeader'
import { Badge } from '@/components/ui/badge'
import type { BranchView } from '../mappers'

export const branchColumns: ColumnDef<any, BranchView>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Branch" />,
    cell: ({ row }) => (
      <Link
        href={`/branches/${row.original.id}`}
        className="font-medium underline-offset-4 hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: 'franchiseName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Franchise" />,
  },
  {
    id: 'location',
    header: 'Location',
    cell: ({ row }) => `${row.original.city}, ${row.original.region}`,
  },
  {
    accessorKey: 'isActive',
    header: 'Active',
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? 'default' : 'outline'}>
        {row.original.isActive ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
]
