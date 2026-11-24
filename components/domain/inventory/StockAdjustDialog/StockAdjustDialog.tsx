"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { StockAdjustDialogProps } from "./StockAdjustDialog.types"

export function StockAdjustDialog({ onAdjust }: StockAdjustDialogProps) {
  const [open, setOpen] = useState(false)
  const [delta, setDelta] = useState(0)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Adjust stock</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust stock</DialogTitle>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label htmlFor="stock-delta">Quantity delta</Label>
          <Input
            id="stock-delta"
            type="number"
            value={delta}
            onChange={(e) => setDelta(Number(e.target.value))}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              void onAdjust(delta)
              setOpen(false)
            }}
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
