"use client"

import { DataTable } from "@/components/data/DataTable"
import { EmptyState } from "@/components/feedback/EmptyState"
import { documentListColumns } from "./DocumentList.columns"
import type { DocumentListProps } from "./DocumentList.types"

export function DocumentList({
  data,
  isLoading,
  emptyState,
}: DocumentListProps) {
  return (
    <DataTable
      ariaLabel="Documents"
      columns={documentListColumns}
      data={data}
      isLoading={isLoading}
      emptyState={emptyState ?? <EmptyState title="No documents" />}
    />
  )
}
