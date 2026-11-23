'use client'

import { DataTable } from '@/components/data/DataTable'
import { EmptyState } from '@/components/feedback/EmptyState'
import { auditColumns } from './AuditTable.columns'
import type { AuditTableProps } from './AuditTable.types'

export function AuditTable({ data, isLoading, emptyState }: AuditTableProps) {
  return (
    <DataTable
      ariaLabel="Audit events"
      columns={auditColumns}
      data={data}
      isLoading={isLoading}
      emptyState={emptyState ?? <EmptyState title="No audit events" />}
    />
  )
}
