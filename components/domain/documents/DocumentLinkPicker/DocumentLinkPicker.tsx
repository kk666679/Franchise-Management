'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { DocumentLinkPickerProps } from './DocumentLinkPicker.types'

export function DocumentLinkPicker({ documents, value, onChange }: DocumentLinkPickerProps) {
  const id = 'doc-link-picker'
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>Linked document</Label>
      <div className="flex gap-2">
        <select id={id} className="h-9 flex-1 rounded-md border border-input bg-background px-3 text-sm" value={value ?? ''} onChange={(e)=>onChange(e.target.value || null)}>
          <option value="">None</option>
          {documents.map((d)=><option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        {value && <Button variant="ghost" onClick={()=>onChange(null)}>Clear</Button>}
      </div>
    </div>
  )
}
