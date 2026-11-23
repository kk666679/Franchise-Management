'use client'

import { Label } from '@/components/ui/label'
import type { TaxRateSelectProps } from './TaxRateSelect.types'

export function TaxRateSelect({ rates, value, onChange, label = 'Tax rate' }: TaxRateSelectProps) {
  const id = 'tax-rate-select'
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
      >
        <option value="">No tax</option>
        {rates.map((r) => (
          <option key={r.id} value={r.id}>{r.name} ({(r.rateBps / 100).toFixed(2)}%)</option>
        ))}
      </select>
    </div>
  )
}
