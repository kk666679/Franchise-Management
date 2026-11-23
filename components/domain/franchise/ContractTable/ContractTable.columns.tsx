'use client'

import Link from 'next/link'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data/DataTableColumnHeader'
import { FormattedDate } from '@/components/common/FormattedDate'
import { ContractLifecycleBadge } from '../ContractLifecycleBadge'
import type { ContractView } from '../mappers'

export const contractColumns: ColumnDef<any, ContractView>[] = [
  {
    accessorKey: 'franchiseName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Franchise" />,
    cell: ({ row }) => (
      <Link
        href={`/contracts/${row.original.id}`}
        className="font-medium underline-offset-4 hover:underline"
      >
        {row.original.franchiseName}
      </Link>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <ContractLifecycleBadge status={row.original.status} />,
  },
  {
    accessorKey: 'effectiveFromIso',
    header: 'Effective from',
    cell: ({ row }) => <FormattedDate iso={row.original.effectiveFromIso} />,
  },
  {
    accessorKey: 'effectiveToIso',
    header: 'Effective to',
    cell: ({ row }) =>
      row.original.effectiveToIso ? (
        <FormattedDate iso={row.original.effectiveToIso} />
      ) : (
        <span className="text-muted">Open-ended</span>
      ),
  },
  {
    accessorKey: 'royaltyRatePct',
    header: 'Royalty',
    cell: ({ row }) => <span className="tabular-nums">{row.original.royaltyRatePct}%</span>,
  },
]
