"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ReportFilterPanelProps } from "./ReportFilterPanel.types"

export function ReportFilterPanel({
  filters,
  onChange,
}: ReportFilterPanelProps) {
  function add() {
    onChange([
      ...filters,
      { id: crypto.randomUUID(), field: "", operator: "eq", value: "" },
    ])
  }
  function update(id: string, patch: Partial<(typeof filters)[number]>) {
    onChange(filters.map((f) => (f.id === id ? { ...f, ...patch } : f)))
  }
  function remove(id: string) {
    onChange(filters.filter((f) => f.id !== id))
  }
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Filters</span>
        <Button size="sm" variant="outline" onClick={add}>
          Add filter
        </Button>
      </div>
      {filters.map((f) => (
        <div key={f.id} className="flex gap-2">
          <Input
            aria-label="Filter field"
            placeholder="Field"
            value={f.field}
            onChange={(e) => update(f.id, { field: e.target.value })}
          />
          <Input
            aria-label="Filter value"
            placeholder="Value"
            value={f.value}
            onChange={(e) => update(f.id, { value: e.target.value })}
          />
          <Button variant="ghost" onClick={() => remove(f.id)}>
            Remove
          </Button>
        </div>
      ))}
      {filters.length === 0 && (
        <p className="text-sm text-muted-foreground">No filters.</p>
      )}
    </div>
  )
}
