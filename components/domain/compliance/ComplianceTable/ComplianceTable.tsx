'use client'

import { DataTable } from '@/components/data/DataTable'
import { EmptyState } from '@/components/feedback/EmptyState'
import { complianceColumns } from './ComplianceTable.columns'
import type { ComplianceTableProps } from './ComplianceTable.types'

export function ComplianceTable({ data, isLoading, emptyState }: ComplianceTableProps) {
  return (
    <DataTable
      ariaLabel="Compliance records"
      columns={complianceColumns}
      data={data}
      isLoading={isLoading}
      emptyState={emptyState ?? <EmptyState title="No compliance records" />}
    />
  )
}
