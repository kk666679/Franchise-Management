'use client'

import { DataTableColumnHeader } from '@/components/data/DataTableColumnHeader'
import type { AttendanceView } from '../mappers'

export const attendanceLogColumns = [
  {
    accessorKey: 'employeeName',
    header: 'Employee',
    sortable: true,
  },
  {
    accessorKey: 'clockInIso',
    header: 'Clock in',
    sortable: true,
    cell: (row: AttendanceView) => row.clockInIso.slice(0,16).replace('T',' '),
  },
  {
    accessorKey: 'clockOutIso',
    header: 'Clock out',
    sortable: true,
    cell: (row: AttendanceView) => row.clockOutIso ? row.clockOutIso.slice(0,16).replace('T',' ') : '—',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    sortable: true,
  },
]
