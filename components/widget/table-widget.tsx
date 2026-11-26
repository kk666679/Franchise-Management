"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

export interface TableWidgetColumn<T> {
  key: string
  header: React.ReactNode
  cell: (row: T, index: number) => React.ReactNode
  className?: string
  headerClassName?: string
  align?: "left" | "center" | "right"
}

export interface TableWidgetProps<T> {
  columns: TableWidgetColumn<T>[]
  data: T[]
  rowKey: (row: T, index: number) => string
  caption?: string
  loading?: boolean
  loadingRows?: number
  onRowClick?: (row: T) => void
  emptyState?: React.ReactNode
  className?: string
  maxHeight?: number
  stickyHeader?: boolean
}

function alignClass(align?: "left" | "center" | "right") {
  if (align === "center") return "text-center"
  if (align === "right") return "text-right"
  return "text-left"
}

export function TableWidget<T>({
  columns,
  data,
  rowKey,
  caption,
  loading = false,
  loadingRows = 4,
  onRowClick,
  emptyState,
  className,
  maxHeight,
  stickyHeader = true,
}: TableWidgetProps<T>) {
  const table = (
    <table className="w-full min-w-[28rem] text-sm" aria-busy={loading || undefined}>
      {caption ? <caption className="sr-only">{caption}</caption> : null}
      <thead
        className={cn(
          "bg-muted/30 text-xs tracking-wide text-muted-foreground uppercase",
          stickyHeader && "sticky top-0 z-[1] backdrop-blur-sm"
        )}
      >
        <tr className="border-b border-border/60">
          {columns.map((col) => (
            <th
              key={col.key}
              scope="col"
              className={cn(
                "px-4 py-3 font-medium whitespace-nowrap",
                alignClass(col.align),
                col.headerClassName
              )}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-border/50">
        {loading
          ? Array.from({ length: loadingRows }).map((_, i) => (
              <tr key={`skeleton-${i}`}>
                {columns.map((col) => (
                  <td key={col.key} className={cn("px-4 py-3", alignClass(col.align), col.className)}>
                    <Skeleton className="h-4 w-full max-w-[10rem]" />
                  </td>
                ))}
              </tr>
            ))
          : data.map((row, index) => {
              const clickable = Boolean(onRowClick)
              return (
                <tr
                  key={rowKey(row, index)}
                  className={cn(
                    "transition-colors",
                    clickable
                      ? "cursor-pointer hover:bg-muted/40 focus-visible:bg-muted/40"
                      : "hover:bg-muted/20"
                  )}
                  onClick={clickable ? () => onRowClick?.(row) : undefined}
                  tabIndex={clickable ? 0 : undefined}
                  onKeyDown={
                    clickable
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            onRowClick?.(row)
                          }
                        }
                      : undefined
                  }
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-4 py-3 text-foreground/90",
                        alignClass(col.align),
                        col.className
                      )}
                    >
                      {col.cell(row, index)}
                    </td>
                  ))}
                </tr>
              )
            })}
      </tbody>
    </table>
  )

  if (!loading && data.length === 0) {
    return <div className={cn("py-2", className)}>{emptyState}</div>
  }

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border/50", className)}>
      {maxHeight ? (
        <ScrollArea style={{ maxHeight }} className="w-full">
          <div className="overflow-x-auto">{table}</div>
        </ScrollArea>
      ) : (
        <div className="overflow-x-auto">{table}</div>
      )}
    </div>
  )
}
