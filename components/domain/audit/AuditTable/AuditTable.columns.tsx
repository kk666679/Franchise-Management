'use client'

import { DataTableColumnHeader } from '@/components/data/DataTableColumnHeader'
import type { AuditEventView } from '../mappers'

export const auditColumns = [
  {
    accessorKey: 'occurredAtIso',
    header: 'When',
    sortable: true,
    cell: (row: AuditEventView) => row.occurredAtIso.slice(0,16).replace('T',' '),
  },
  {
    accessorKey: 'actorName',
    header: 'Actor',
    sortable: true,
  },
  {
    accessorKey: 'action',
    header: 'Action',
    sortable: true,
  },
  {
    accessorKey: 'entityType',
    header: 'Entity',
    sortable: true,
  },
  {
    accessorKey: 'summary',
    header: 'Summary',
    sortable: true,
  },
]
