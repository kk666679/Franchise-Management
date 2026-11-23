'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ComplianceFormProps, ComplianceFormValues } from './ComplianceForm.types'

export function ComplianceForm({ initial, onSubmit, onCancel }: ComplianceFormProps) {
  const [values, setValues] = useState<ComplianceFormValues>({ title: initial?.title ?? '', category: initial?.category ?? '', ownerId: initial?.ownerId ?? '', dueDateIso: initial?.dueDateIso ?? '' })
  return (
    <form className="space-y-4" onSubmit={(e)=>{e.preventDefault(); void onSubmit(values)}}>
      <div className="space-y-1.5"><Label htmlFor="comp-title">Title</Label><Input id="comp-title" value={values.title} onChange={(e)=>setValues({...values,title:e.target.value})} /></div>
      <div className="space-y-1.5"><Label htmlFor="comp-category">Category</Label><Input id="comp-category" value={values.category} onChange={(e)=>setValues({...values,category:e.target.value})} /></div>
      <div className="space-y-1.5"><Label htmlFor="comp-owner">Owner ID</Label><Input id="comp-owner" value={values.ownerId} onChange={(e)=>setValues({...values,ownerId:e.target.value})} /></div>
      <div className="space-y-1.5"><Label htmlFor="comp-due">Due date (ISO)</Label><Input id="comp-due" value={values.dueDateIso ?? ''} onChange={(e)=>setValues({...values,dueDateIso:e.target.value})} /></div>
      <div className="flex justify-end gap-2">{onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}<Button type="submit">Save compliance</Button></div>
    </form>
  )
}
