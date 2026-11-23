'use client'

import { DataTableColumnHeader } from '@/components/data/DataTableColumnHeader'
import type { InvoiceView } from '../mappers'

export const invoiceColumns = [
  {
    accessorKey: 'number',
    header: 'Invoice',
    sortable: true,
  },
  {
    accessorKey: 'franchiseName',
    header: 'Franchise',
    sortable: true,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    sortable: true,
  },
  {
    accessorKey: 'totalCents',
    header: 'Total',
    sortable: true,
    cell: (row: InvoiceView) => <span className="tabular-nums">{new Intl.NumberFormat(undefined,{style:'currency',currency:row.currency}).format(row.totalCents/100)}</span>,
  },
  {
    accessorKey: 'dueDateIso',
    header: 'Due',
    sortable: true,
    cell: (row: InvoiceView) => row.dueDateIso.slice(0,10),
  },
]
