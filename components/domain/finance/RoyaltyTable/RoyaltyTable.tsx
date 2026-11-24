"use client"

import { DataTable } from "@/components/data/DataTable"
import { EmptyState } from "@/components/feedback/EmptyState"
import { royaltyColumns } from "./RoyaltyTable.columns"
import type { RoyaltyTableProps } from "./RoyaltyTable.types"

export function RoyaltyTable({
  data,
  isLoading,
  emptyState,
}: RoyaltyTableProps) {
  return (
    <DataTable
      ariaLabel="Royalties"
      columns={royaltyColumns}
      data={data}
      isLoading={isLoading}
      emptyState={emptyState ?? <EmptyState title="No royalties" />}
    />
  )
}
