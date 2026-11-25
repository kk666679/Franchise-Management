"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export type PosCashDrawerProps = {
  onOpenDrawer: () => Promise<void> | void
  onCashMove: (direction: "in" | "out", amountCents: number, reason: string) => Promise<void> | void
  disabled?: boolean
}

export function PosCashDrawer({ onOpenDrawer, onCashMove, disabled = false }: PosCashDrawerProps) {
  const [amount, setAmount] = useState(0)
  const [reason, setReason] = useState("")
  return (
    <Card className="space-y-3 p-4">
      <h3 className="font-semibold">Cash drawer</h3>
      <Button variant="outline" disabled={disabled} onClick={() => void onOpenDrawer()}>Open drawer</Button>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="cash-amount">Amount (cents)</Label>
          <Input id="cash-amount" type="number" min={0} value={amount} onChange={(e) => setAmount(Number(e.target.value))} disabled={disabled} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="cash-reason">Reason</Label>
          <Input id="cash-reason" value={reason} onChange={(e) => setReason(e.target.value)} disabled={disabled} />
        </div>
      </div>
      <div className="flex gap-2">
        <Button disabled={disabled || amount <= 0 || !reason.trim()} onClick={() => void onCashMove("in", amount, reason.trim())}>Cash in</Button>
        <Button variant="outline" disabled={disabled || amount <= 0 || !reason.trim()} onClick={() => void onCashMove("out", amount, reason.trim())}>Cash out</Button>
      </div>
    </Card>
  )
}
