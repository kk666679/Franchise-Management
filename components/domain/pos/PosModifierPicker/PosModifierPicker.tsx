"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import type { PosModifierPickerProps } from "./PosModifierPicker.types"

export function PosModifierPicker({ itemName, options, onChange, disabled = false }: PosModifierPickerProps) {
  const selected = options.filter((o) => o.selected).map((o) => o.id)
  const toggle = (id: string, checked: boolean) => {
    const next = checked ? [...selected, id] : selected.filter((x) => x !== id)
    onChange(next)
  }
  return (
    <Card className="space-y-3 p-4" aria-label={`Modifiers for ${itemName}`}>
      <h3 className="font-semibold">Modifiers</h3>
      <p className="text-sm text-muted-foreground">{itemName}</p>
      <ul className="space-y-2">
        {options.map((opt) => (
          <li key={opt.id} className="flex items-center gap-2 text-sm">
            <Checkbox
              id={`mod-${opt.id}`}
              checked={!!opt.selected}
              disabled={disabled}
              onCheckedChange={(v) => toggle(opt.id, v === true)}
            />
            <Label htmlFor={`mod-${opt.id}`} className="flex flex-1 justify-between">
              <span>{opt.name}</span>
              <span className="tabular-nums text-muted-foreground">+{(opt.priceCents / 100).toFixed(2)}</span>
            </Label>
          </li>
        ))}
        {options.length === 0 ? <li className="text-sm text-muted-foreground">No modifiers available.</li> : null}
      </ul>
    </Card>
  )
}
