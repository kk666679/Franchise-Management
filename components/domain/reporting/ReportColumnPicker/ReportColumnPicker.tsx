"use client"

import { Checkbox } from "@/components/ui/checkbox"
import type { ReportColumnPickerProps } from "./ReportColumnPicker.types"

export function ReportColumnPicker({
  columns,
  onChange,
}: ReportColumnPickerProps) {
  function toggle(id: string, selected: boolean) {
    onChange(columns.map((c) => (c.id === id ? { ...c, selected } : c)))
  }
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">Columns</legend>
      {columns.map((c) => (
        <label key={c.id} className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={c.selected}
            onCheckedChange={(v) => toggle(c.id, Boolean(v))}
          />
          {c.label}
        </label>
      ))}
      {columns.length === 0 && (
        <p className="text-sm text-muted-foreground">No columns available.</p>
      )}
    </fieldset>
  )
}
