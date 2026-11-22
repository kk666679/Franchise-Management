'use client'

import { DataTable } from '@/components/data/DataTable'
import { EmptyState } from '@/components/feedback/EmptyState'
import { branchColumns } from './BranchTable.columns'
import type { BranchTableProps } from './BranchTable.types'

export function BranchTable({ data, emptyState }: BranchTableProps) {
  return (
    <DataTable
      ariaLabel="Branches"
      columns={branchColumns}
      data={data}
      emptyState={emptyState ?? <EmptyState title="No branches" />}
    />
  )
}
