"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { PosTableMapProps } from "./PosTableMap.types"

const statusClass: Record<string, string> = {
  available: "border-emerald-500/30",
  occupied: "border-amber-500/30",
  reserved: "border-sky-500/30",
  dirty: "border-rose-500/30",
}

export function PosTableMap({ tables, selectedTableId, onSelect }: PosTableMapProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Tables</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4" role="listbox" aria-label="Table map">
        {tables.map((table) => (
          <Button
            key={table.id}
            type="button"
            variant={selectedTableId === table.id ? "default" : "outline"}
            className={cn("h-20 flex-col gap-1", statusClass[table.status])}
            role="option"
            aria-selected={selectedTableId === table.id}
            onClick={() => onSelect(table.id)}
          >
            <span className="font-medium">{table.label}</span>
            <span className="text-xs opacity-80">{table.seats} seats · {table.status}</span>
          </Button>
        ))}
        {tables.length === 0 ? <p className="text-sm text-muted-foreground">No tables configured.</p> : null}
      </div>
    </div>
  )
}
