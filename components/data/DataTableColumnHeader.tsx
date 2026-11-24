"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

export type DataTableColumnHeaderProps = {
  column: { accessorKey: string; sortable?: boolean; className?: string }
  title: string
  currentSort: { id: string; direction: "asc" | "desc" } | null
  onSort: (next: { id: string; direction: "asc" | "desc" } | null) => void
  className?: string
}

export function DataTableColumnHeader({
  column,
  title,
  currentSort,
  onSort,
  className,
}: DataTableColumnHeaderProps) {
  if (!column.sortable) return <div className={cn(className)}>{title}</div>
  const active = currentSort?.id === column.accessorKey
  const direction = active ? currentSort.direction : "asc"
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("-ml-3 h-8", className)}
      onClick={() => {
        if (active && direction === "asc") {
          onSort(null)
        } else {
          onSort({
            id: column.accessorKey,
            direction: active ? (direction === "asc" ? "desc" : "asc") : "asc",
          })
        }
      }}
    >
      <span>{title}</span>
      {active ? (
        direction === "desc" ? (
          <ChevronDown className="ml-2 size-4" />
        ) : (
          <ChevronUp className="ml-2 size-4" />
        )
      ) : (
        <ChevronsUpDown className="ml-2 size-4" />
      )}
    </Button>
  )
}
