'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { RegisterOpenDialogProps } from './RegisterOpenDialog.types'

export function RegisterOpenDialog({ onOpenRegister }: RegisterOpenDialogProps) {
  const [open, setOpen] = useState(false)
  const [floatCents, setFloatCents] = useState(0)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button>Open register</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Open register</DialogTitle></DialogHeader>
        <div className="space-y-1.5">
          <Label htmlFor="opening-float">Opening float (cents)</Label>
          <Input id="opening-float" type="number" min={0} value={floatCents} onChange={(e) => setFloatCents(Number(e.target.value))} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => { void onOpenRegister(floatCents); setOpen(false) }}>Open</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
