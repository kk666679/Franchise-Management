"use client"

import { DataTable } from "@/components/data/DataTable"
import { EmptyState } from "@/components/feedback/EmptyState"
import { purchaseOrderColumns } from "./PurchaseOrderTable.columns"
import type { PurchaseOrderTableProps } from "./PurchaseOrderTable.types"

export function PurchaseOrderTable({
  data,
  isLoading,
  emptyState,
}: PurchaseOrderTableProps) {
  return (
    <DataTable
      ariaLabel="Purchase orders"
      columns={purchaseOrderColumns}
      data={data}
      isLoading={isLoading}
      emptyState={emptyState ?? <EmptyState title="No purchase orders" />}
    />
  )
}
