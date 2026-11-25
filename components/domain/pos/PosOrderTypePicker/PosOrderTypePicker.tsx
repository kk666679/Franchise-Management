"use client"

import { Button } from "@/components/ui/button"
import type { PosOrderType } from "../types"

export type PosOrderTypePickerProps = {
  value: PosOrderType
  onChange: (value: PosOrderType) => void
  disabled?: boolean
}

const options: { value: PosOrderType; label: string }[] = [
  { value: "dine_in", label: "Dine in" },
  { value: "takeaway", label: "Takeaway" },
  { value: "delivery", label: "Delivery" },
]

export function PosOrderTypePicker({ value, onChange, disabled = false }: PosOrderTypePickerProps) {
  return (
    <div role="radiogroup" aria-label="Order type" className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <Button
          key={opt.value}
          type="button"
          variant={value === opt.value ? "default" : "outline"}
          aria-pressed={value === opt.value}
          disabled={disabled}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  )
}
