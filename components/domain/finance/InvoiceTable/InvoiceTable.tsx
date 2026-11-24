"use client"

import { DataTable } from "@/components/data/DataTable"
import { EmptyState } from "@/components/feedback/EmptyState"
import { invoiceColumns } from "./InvoiceTable.columns"
import type { InvoiceTableProps } from "./InvoiceTable.types"

export function InvoiceTable({
  data,
  isLoading,
  emptyState,
}: InvoiceTableProps) {
  return (
    <DataTable
      ariaLabel="Invoices"
      columns={invoiceColumns}
      data={data}
      isLoading={isLoading}
      emptyState={emptyState ?? <EmptyState title="No invoices" />}
    />
  )
}
