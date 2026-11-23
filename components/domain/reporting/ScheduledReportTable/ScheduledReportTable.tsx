'use client'

import { DataTable } from '@/components/data/DataTable'
import { EmptyState } from '@/components/feedback/EmptyState'
import { scheduledReportColumns } from './ScheduledReportTable.columns'
import type { ScheduledReportTableProps } from './ScheduledReportTable.types'

export function ScheduledReportTable({ data, isLoading, emptyState }: ScheduledReportTableProps) {
  return (
    <DataTable
      ariaLabel="Scheduled reports"
      columns={scheduledReportColumns}
      data={data}
      isLoading={isLoading}
      emptyState={emptyState ?? <EmptyState title="No scheduled reports" />}
    />
  )
}
