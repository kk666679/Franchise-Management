"use client"

import { DataTable } from "@/components/data/DataTable"
import { EmptyState } from "@/components/feedback/EmptyState"
import { productColumns } from "./ProductTable.columns"
import type { ProductTableProps } from "./ProductTable.types"

export function ProductTable({
  data,
  isLoading,
  emptyState,
}: ProductTableProps) {
  return (
    <DataTable
      ariaLabel="Products"
      columns={productColumns}
      data={data}
      isLoading={isLoading}
      emptyState={emptyState ?? <EmptyState title="No products" />}
    />
  )
}
