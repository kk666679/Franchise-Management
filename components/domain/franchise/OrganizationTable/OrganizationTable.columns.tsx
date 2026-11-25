'use client'

import Link from 'next/link'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data/DataTableColumnHeader'
import { FormattedDate } from '@/components/common/FormattedDate'
import { OrganizationStatusBadge } from '../OrganizationStatusBadge'
import type { OrganizationView } from '../mappers'

export const organizationColumns: ColumnDef<OrganizationView>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Organization" />,
    cell: ({ row }) => (
      <Link href={`/organizations/${row.original.id}`} className="font-medium hover:underline">
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: 'legalName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Legal name" />,
  },
  {
    accessorKey: 'franchiseCount',
    header: 'Franchises',
    cell: ({ row }) => <span className="tabular-nums">{row.original.franchiseCount}</span>,
  },
  {
    accessorKey: 'branchCount',
    header: 'Branches',
    cell: ({ row }) => <span className="tabular-nums">{row.original.branchCount}</span>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <OrganizationStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'createdAtIso',
    header: 'Created',
    cell: ({ row }) => <FormattedDate iso={row.original.createdAtIso} />,
  },
]
