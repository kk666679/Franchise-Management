'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import type { ApprovalDecisionDialogProps } from './ApprovalDecisionDialog.types'

export function ApprovalDecisionDialog({ decision, onConfirm, triggerLabel }: ApprovalDecisionDialogProps) {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState('')
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant={decision === 'approved' ? 'default' : 'outline'}>{triggerLabel}</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{decision === 'approved' ? 'Approve' : 'Reject'} request</DialogTitle></DialogHeader>
        <div className="space-y-1.5"><Label htmlFor="decision-note">Note</Label><Textarea id="decision-note" value={note} onChange={(e)=>setNote(e.target.value)} /></div>
        <DialogFooter><Button variant="outline" onClick={()=>setOpen(false)}>Cancel</Button><Button onClick={()=>{void onConfirm(note); setOpen(false)}}>Confirm</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
