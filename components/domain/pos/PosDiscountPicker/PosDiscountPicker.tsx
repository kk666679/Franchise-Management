"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { PosDiscountPickerProps } from "./PosDiscountPicker.types"

export function PosDiscountPicker({ discounts, onApplyCode, onRemove, disabled = false }: PosDiscountPickerProps) {
  const [code, setCode] = useState("")
  return (
    <Card className="space-y-3 p-4">
      <h3 className="font-semibold">Discounts</h3>
      <div className="flex gap-2">
        <Input aria-label="Discount code" placeholder="Promo code" value={code} onChange={(e) => setCode(e.target.value)} disabled={disabled} />
        <Button disabled={disabled || !code.trim()} onClick={() => { void onApplyCode(code.trim()); setCode("") }}>Apply</Button>
      </div>
      <ul className="space-y-2">
        {discounts.map((d) => (
          <li key={d.id} className="flex items-center justify-between text-sm">
            <span>{d.label}</span>
            <Button size="sm" variant="ghost" onClick={() => onRemove(d.id)} disabled={disabled}>Remove</Button>
          </li>
        ))}
        {discounts.length === 0 ? <li className="text-sm text-muted-foreground">No discounts applied.</li> : null}
      </ul>
    </Card>
  )
}
