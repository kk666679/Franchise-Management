"use client"

import * as React from "react"
import { DataTableColumnHeader } from "@/components/data/DataTableColumnHeader"
import { EmptyState } from "@/components/feedback/EmptyState"
import { LoadingSpinner } from "@/components/feedback/loading-spinner"
import { cn } from "@/lib/utils"

export type DataColumn<TData> = {
  accessorKey: string
  header: string
  cell?: (row: TData) => React.ReactNode
  sortable?: boolean
  className?: string
}

export type DataTableProps<TData> = {
  columns: DataColumn<TData>[]
  data: TData[]
  ariaLabel?: string
  isLoading?: boolean
  loading?: boolean
  emptyState?: React.ReactNode
  emptyTitle?: string
  emptyDescription?: string
  className?: string
}

export function DataTable<TData>({
  columns,
  data,
  ariaLabel = "Data table",
  isLoading,
  loading,
  emptyState,
  emptyTitle = "No records found",
  emptyDescription,
  className,
}: DataTableProps<TData>) {
  const [sort, setSort] = React.useState<{
    id: string
    direction: "asc" | "desc"
  } | null>(null)

  const sorted = React.useMemo(() => {
    if (!sort) return [...data]
    const column = columns.find((c) => c.accessorKey === sort.id)
    if (!column) return [...data]
    return [...data].sort((left, right) => {
      const a = left[column.accessorKey as keyof TData]
      const b = right[column.accessorKey as keyof TData]
      const comparison = String(a ?? "").localeCompare(
        String(b ?? ""),
        undefined,
        { numeric: true }
      )
      return sort.direction === "asc" ? comparison : -comparison
    })
  }, [columns, data, sort])

  const busy = isLoading ?? loading ?? false
  if (busy) {
    return (
      <div className="flex min-h-40 items-center justify-center rounded-2xl border border-border">
        <LoadingSpinner label="Loading table" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <>
        {emptyState ?? (
          <EmptyState title={emptyTitle} description={emptyDescription} />
        )}
      </>
    )
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card/60",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table
          className="w-full min-w-[32rem] text-left text-sm"
          aria-label={ariaLabel}
        >
          <thead className="border-b border-border bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              {columns.map((column) => (
                <th key={column.accessorKey} className="px-4 py-3 font-medium">
                  <DataTableColumnHeader
                    column={column}
                    title={column.header}
                    currentSort={sort}
                    onSort={setSort}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {sorted.map((row) => (
              <tr
                key={String((row as unknown as { id?: string }).id)}
                className="transition-colors hover:bg-muted/30"
              >
                {columns.map((column) => (
                  <td key={column.accessorKey} className="px-4 py-3">
                    {column.cell
                      ? column.cell(row as TData)
                      : String(
                          (row as unknown as Record<string, unknown>)[
                            column.accessorKey
                          ] ?? "—"
                        )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
