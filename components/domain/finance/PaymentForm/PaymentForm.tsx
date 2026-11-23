'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { PaymentFormProps, PaymentFormValues } from './PaymentForm.types'

export function PaymentForm({ initial, onSubmit, onCancel }: PaymentFormProps) {
  const [values, setValues] = useState<PaymentFormValues>({
    invoiceId: initial?.invoiceId ?? '',
    amountCents: initial?.amountCents ?? 0,
    method: initial?.method ?? 'bank_transfer',
  })
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => { e.preventDefault(); void onSubmit(values) }}
    >
      <div className="space-y-1.5">
        <Label htmlFor="payment-invoice">Invoice ID</Label>
        <Input id="payment-invoice" value={values.invoiceId} onChange={(e) => setValues({ ...values, invoiceId: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="payment-amount">Amount (cents)</Label>
        <Input id="payment-amount" type="number" min={0} value={values.amountCents} onChange={(e) => setValues({ ...values, amountCents: Number(e.target.value) })} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="payment-method">Method</Label>
        <select id="payment-method" className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={values.method} onChange={(e) => setValues({ ...values, method: e.target.value as PaymentFormValues['method'] })}>
          <option value="bank_transfer">Bank transfer</option>
          <option value="card">Card</option>
          <option value="cash">Cash</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="flex gap-2 justify-end">
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
        <Button type="submit">Record payment</Button>
      </div>
    </form>
  )
}
