"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export type ColumnType = "text" | "number" | "date" | "currency" | "action"
export type SortDirection = "asc" | "desc" | "none"
export type SelectionMode = "single" | "multiple" | "none"

export interface Column<T> {
  header: string
  accessor: keyof T
  type?: ColumnType
  width?: number | "auto"
  hidden?: boolean
  className?: string
  Cell?: React.ComponentType<{ value: any; row: T }>
  sort?: boolean
  select?: boolean
}

export interface UseDataTableOptions<T> {
  initialPageSize?: number
  initialSort?: { column: keyof T; direction: SortDirection }
  selectionMode?: SelectionMode
  rowId?: keyof T
  onSelectionChange?: (ids: (keyof T)[]) => void
  onSortChange?: (column: keyof T, direction: SortDirection) => void
  onPageChange?: (page: number, pageSize: number) => void
}

export function DataTableSimple<T>({
  columns,
  data,
  selectionMode = "none",
  onRowSelect,
}: { columns: Column<T>[]; data: T[]; selectionMode?: SelectionMode; onRowSelect?: (row: T) => void }) {
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [sort, setSort] = React.useState<{ column: keyof T; direction: SortDirection }>({
    column: columns[0].accessor,
    direction: "asc",
  })

  const sorted = [...data].sort((a, b) => {
    const av = a[sort.column], bv = b[sort.column]
    if (typeof av === "string" && typeof bv === "string")
      return sort.direction === "asc" ? av.localeCompare(bv) : bv.localeCompare(av)
    return sort.direction === "asc" ? (av > bv ? 1 : -1) : (bv > av ? 1 : -1)
  })

  const total = Math.ceil(data.length / pageSize)
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const pageData = sorted.slice(start, end)

  const handleSort = (col: keyof T) => {
    if (sort.column === col) setSort({ column: col, direction: sort.direction === "asc" ? "desc" : "asc" })
    else setSort({ column: col, direction: "asc" })
  }

  return (
    <div className="bg-card p-4 rounded-lg">
      <div className="flex flex-col sm:flex-row items-center justify-between gap mb-4">
        <h3 className="text-lg font-medium">{data.length > 0 ? "Records" : "No records"}</h3>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="rounded-md border px-2 py-1 text-sm"
        >
          <option value={5}>5</option><option value={10}>10</option><option value={20}>20</option>
        </select>
      </div>

      <table className="w-full rounded-lg border border-border bg-card">
        <thead>
          <tr>
            {selectionMode !== "none" && <th className="p-2"><Input type="checkbox" /></th>}
            {columns.map((c) => (
              <th key={String(c.accessor)} className="p-2 text-sm font-medium">
                {c.header}{sort.column === c.accessor ? sort.direction === "asc" ? " ▲" : " ▼" : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageData.map((row) => (
            <tr key={String(row[columns[0].accessor])} className="hover:bg-accent/10">
              {selectionMode !== "none" && <td className="p-2"><Input type="checkbox" /></td>}
              {columns.map((c) => {
                const v = row[c.accessor]
                return <td key={String(c.accessor)} className="p-2 text-sm">{c.type === "currency" ? `$${v}` : String(v)}</td>
              })}
            </tr>
          ))}
          {data.length === 0 && <tr><td colSpan={columns.length} className="p-4 text-center text-muted-foreground">No data</td></tr>}
        </tbody>
      </table>

      {total > 1 && (
        <div className="flex justify-center mt-3">
          <span>Page {page} of {total}</span>
        </div>
      )}
    </div>
  )
}
