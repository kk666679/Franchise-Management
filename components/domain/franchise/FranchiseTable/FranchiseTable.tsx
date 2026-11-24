"use client"

import { DataTable } from "@/components/data/DataTable"
import { EmptyState } from "@/components/feedback/EmptyState"
import { franchiseColumns } from "./FranchiseTable.columns"
import type { FranchiseTableProps } from "./FranchiseTable.types"

export function FranchiseTable({
  data,
  isLoading,
  emptyState,
}: FranchiseTableProps) {
  return (
    <DataTable
      ariaLabel="Franchises"
      columns={franchiseColumns}
      data={data}
      isLoading={isLoading}
      emptyState={emptyState ?? <EmptyState title="No franchises yet" />}
    />
  )
}
