"use client"

import { DataTable } from "@/components/data/DataTable"
import { EmptyState } from "@/components/feedback/EmptyState"
import { documentVersionListColumns } from "./DocumentVersionList.columns"
import type { DocumentVersionListProps } from "./DocumentVersionList.types"

export function DocumentVersionList({
  data,
  isLoading,
  emptyState,
}: DocumentVersionListProps) {
  return (
    <DataTable
      ariaLabel="Document versions"
      columns={documentVersionListColumns}
      data={data}
      isLoading={isLoading}
      emptyState={emptyState ?? <EmptyState title="No versions" />}
    />
  )
}
