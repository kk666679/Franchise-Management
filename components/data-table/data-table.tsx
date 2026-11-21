"use client"

import { ChevronDown, ChevronUp } from "lucide-react"
import { useMemo, useState } from "react"

import { EmptyState } from "@/components/feedback/empty-state"
import { LoadingSpinner } from "@/components/feedback/loading-spinner"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

export type DataTableColumn<T> = {
  id: string
  header: string
  accessor?: keyof T
  cell?: (row: T) => React.ReactNode
  sortable?: boolean
  className?: string
}

export type DataTableProps<T extends { id: string }> = {
  data: readonly T[]
  columns: readonly DataTableColumn<T>[]
  getRowLabel?: (row: T) => string
  loading?: boolean
  selectable?: boolean
  pageSize?: number
  emptyTitle?: string
  emptyDescription?: string
  className?: string
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  getRowLabel = (row) => row.id,
  loading = false,
  selectable = false,
  pageSize = 10,
  emptyTitle = "No records found",
  emptyDescription = "Try adjusting your filters or add a new record.",
  className,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<{ id: string; direction: "asc" | "desc" } | null>(null)
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set())

  const sorted = useMemo(() => {
    if (!sort) return [...data]
    const column = columns.find((item) => item.id === sort.id)
    if (!column?.accessor) return [...data]
    return [...data].sort((left, right) => {
      const a = left[column.accessor!]
      const b = right[column.accessor!]
      const comparison = String(a ?? "").localeCompare(String(b ?? ""), undefined, { numeric: true })
      return sort.direction === "asc" ? comparison : -comparison
    })
  }, [columns, data, sort])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const rows = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const allVisibleSelected = rows.length > 0 && rows.every((row) => selected.has(row.id))

  function toggleSort(column: DataTableColumn<T>) {
    if (!column.sortable || !column.accessor) return
    setPage(1)
    setSort((current) => current?.id === column.id
      ? current.direction === "asc" ? { id: column.id, direction: "desc" } : null
      : { id: column.id, direction: "asc" })
  }

  function toggleAllVisible() {
    const next = new Set(selected)
    if (allVisibleSelected) rows.forEach((row) => next.delete(row.id))
    else rows.forEach((row) => next.add(row.id))
    setSelected(next)
  }

  function toggleRow(id: string) {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  if (loading) return <div className="flex min-h-40 items-center justify-center rounded-2xl border border-border"><LoadingSpinner label="Loading table" /></div>
  if (data.length === 0) return <EmptyState description={emptyDescription} title={emptyTitle} />

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-card/60", className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[42rem] text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              {selectable ? <th className="w-12 px-4 py-3"><Checkbox aria-label="Select all visible rows" checked={allVisibleSelected} onCheckedChange={toggleAllVisible} /></th> : null}
              {columns.map((column) => {
                const active = sort?.id === column.id
                return <th className={cn("px-4 py-3 font-medium", column.className)} key={column.id}>
                  <button className={cn("inline-flex items-center gap-1", column.sortable && "cursor-pointer hover:text-foreground")} disabled={!column.sortable} onClick={() => toggleSort(column)} type="button">
                    {column.header}
                    {active ? sort.direction === "asc" ? <ChevronUp aria-hidden="true" className="size-3" /> : <ChevronDown aria-hidden="true" className="size-3" /> : null}
                  </button>
                </th>
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {rows.map((row) => <tr className="transition-colors hover:bg-muted/30" key={row.id}>
              {selectable ? <td className="px-4 py-3"><Checkbox aria-label={`Select ${getRowLabel(row)}`} checked={selected.has(row.id)} onCheckedChange={() => toggleRow(row.id)} /></td> : null}
              {columns.map((column) => <td className={cn("px-4 py-3", column.className)} key={column.id}>{column.cell ? column.cell(row) : column.accessor ? String(row[column.accessor] ?? "—") : "—"}</td>)}
            </tr>)}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-2 border-t border-border px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>{selected.size > 0 ? `${selected.size} selected · ` : ""}{sorted.length} record{sorted.length === 1 ? "" : "s"}</span>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-border px-3 py-1.5 disabled:opacity-50" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} type="button">Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button className="rounded-lg border border-border px-3 py-1.5 disabled:opacity-50" disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} type="button">Next</button>
        </div>
      </div>
    </div>
  )
}
