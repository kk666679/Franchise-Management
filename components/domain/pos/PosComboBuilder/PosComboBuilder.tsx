"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export type PosComboSlot = {
  id: string
  label: string
  options: { id: string; name: string }[]
  selectedId?: string | null
}

export type PosComboBuilderProps = {
  name: string
  slots: PosComboSlot[]
  onSelect: (slotId: string, optionId: string) => void
  onConfirm: () => void
  disabled?: boolean
}

export function PosComboBuilder({ name, slots, onSelect, onConfirm, disabled = false }: PosComboBuilderProps) {
  const complete = slots.every((s) => !!s.selectedId)
  return (
    <Card className="space-y-4 p-4">
      <h3 className="font-semibold">Build combo: {name}</h3>
      {slots.map((slot) => (
        <fieldset key={slot.id} className="space-y-2">
          <legend className="text-sm font-medium">{slot.label}</legend>
          <div className="flex flex-wrap gap-2">
            {slot.options.map((opt) => (
              <Button
                key={opt.id}
                type="button"
                size="sm"
                variant={slot.selectedId === opt.id ? "default" : "outline"}
                disabled={disabled}
                onClick={() => onSelect(slot.id, opt.id)}
              >
                {opt.name}
              </Button>
            ))}
          </div>
        </fieldset>
      ))}
      <Button disabled={disabled || !complete} onClick={onConfirm}>Add combo</Button>
    </Card>
  )
}
