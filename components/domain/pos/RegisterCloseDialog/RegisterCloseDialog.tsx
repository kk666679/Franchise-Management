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
import type { RegisterCloseDialogProps } from "./RegisterCloseDialog.types"

export function RegisterCloseDialog({
  onCloseRegister,
}: RegisterCloseDialogProps) {
  const [open, setOpen] = useState(false)
  const [countedCents, setCountedCents] = useState(0)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Close register</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Close register</DialogTitle>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label htmlFor="counted-cash">Counted cash (cents)</Label>
          <Input
            id="counted-cash"
            type="number"
            min={0}
            value={countedCents}
            onChange={(e) => setCountedCents(Number(e.target.value))}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              void onCloseRegister(countedCents)
              setOpen(false)
            }}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
