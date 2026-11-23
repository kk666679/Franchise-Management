'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import type { BranchView } from '../mappers'

export const branchColumns = [
  {
    accessorKey: 'name',
    header: 'Branch',
    sortable: true,
    cell: (row: BranchView) => (
      <Link
        href={`/branches/${row.id}`}
        className="font-medium underline-offset-4 hover:underline"
      >
        {row.name}
      </Link>
    ),
  },
  {
    accessorKey: 'franchiseName',
    header: 'Franchise',
    sortable: true,
  },
  {
    accessorKey: 'city',
    header: 'Location',
    sortable: true,
    cell: (row: BranchView) => `${row.city}, ${row.region}`,
  },
  {
    accessorKey: 'isActive',
    header: 'Active',
    sortable: true,
    cell: (row: BranchView) => (
      <Badge variant={row.isActive ? 'default' : 'outline'}>
        {row.isActive ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
]
