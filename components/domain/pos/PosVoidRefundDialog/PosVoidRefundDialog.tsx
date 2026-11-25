"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export type PosVoidRefundDialogProps = {
  mode: "void" | "refund"
  receiptNumber: string
  onConfirm: (reason: string) => Promise<void> | void
  disabled?: boolean
}

export function PosVoidRefundDialog({ mode, receiptNumber, onConfirm, disabled = false }: PosVoidRefundDialogProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const title = mode === "void" ? "Void sale" : "Refund sale"
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="destructive" disabled={disabled}>{title}</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{title} {receiptNumber}</DialogTitle></DialogHeader>
        <div className="space-y-1.5">
          <Label htmlFor={`reason-${receiptNumber}`}>Reason</Label>
          <Input id={`reason-${receiptNumber}`} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Required for audit" />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="destructive" disabled={!reason.trim()} onClick={() => { void onConfirm(reason.trim()); setOpen(false); setReason("") }}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
