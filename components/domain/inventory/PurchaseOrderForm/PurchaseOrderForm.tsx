'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { PurchaseOrderFormProps, PurchaseOrderFormValues } from './PurchaseOrderForm.types'

export function PurchaseOrderForm({ initial, onSubmit, onCancel }: PurchaseOrderFormProps) {
  const [values, setValues] = useState<PurchaseOrderFormValues>({ supplierName: initial?.supplierName ?? '', notes: initial?.notes ?? '' })
  return (
    <form className="space-y-4" onSubmit={(e)=>{e.preventDefault(); void onSubmit(values)}}>
      <div className="space-y-1.5"><Label htmlFor="po-supplier">Supplier</Label><Input id="po-supplier" value={values.supplierName} onChange={(e)=>setValues({...values,supplierName:e.target.value})} /></div>
      <div className="space-y-1.5"><Label htmlFor="po-notes">Notes</Label><Input id="po-notes" value={values.notes ?? ''} onChange={(e)=>setValues({...values,notes:e.target.value})} /></div>
      <div className="flex justify-end gap-2">{onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}<Button type="submit">Save purchase order</Button></div>
    </form>
  )
}
