'use client'

import { DataTableColumnHeader } from '@/components/data/DataTableColumnHeader'
import type { DocumentVersionView } from '../mappers'

export const documentVersionListColumns = [
  {
    accessorKey: 'version',
    header: 'Version',
    sortable: true,
    cell: (row: DocumentVersionView) => <span className="tabular-nums">v{row.version}</span>,
  },
  {
    accessorKey: 'createdAtIso',
    header: 'Created',
    sortable: true,
    cell: (row: DocumentVersionView) => row.createdAtIso.slice(0,10),
  },
  {
    accessorKey: 'createdBy',
    header: 'By',
    sortable: true,
  },
  {
    accessorKey: 'note',
    header: 'Note',
    sortable: true,
    cell: (row: DocumentVersionView) => row.note ?? '—',
  },
]
