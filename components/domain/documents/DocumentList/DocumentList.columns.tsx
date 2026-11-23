'use client'

import { DataTableColumnHeader } from '@/components/data/DataTableColumnHeader'
import type { DocumentView } from '../mappers'

export const documentListColumns = [
  {
    accessorKey: 'name',
    header: 'Name',
    sortable: true,
  },
  {
    accessorKey: 'category',
    header: 'Category',
    sortable: true,
  },
  {
    accessorKey: 'version',
    header: 'Version',
    sortable: true,
    cell: (row: DocumentView) => <span className="tabular-nums">v{row.version}</span>,
  },
  {
    accessorKey: 'updatedAtIso',
    header: 'Updated',
    sortable: true,
    cell: (row: DocumentView) => row.updatedAtIso.slice(0,10),
  },
  {
    accessorKey: 'updatedBy',
    header: 'By',
    sortable: true,
  },
]
