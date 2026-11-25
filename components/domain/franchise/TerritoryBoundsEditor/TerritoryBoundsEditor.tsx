'use client'

import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import type { TerritoryBounds } from './TerritoryBoundsEditor.types'

const FIELDS: { key: keyof TerritoryBounds; label: string; min: number; max: number }[] = [
  { key: 'north', label: 'North (lat)', min: -90, max: 90 },
  { key: 'south', label: 'South (lat)', min: -90, max: 90 },
  { key: 'east', label: 'East (lon)', min: -180, max: 180 },
  { key: 'west', label: 'West (lon)', min: -180, max: 180 },
]

export function TerritoryBoundsEditor({
  value, onChange,
}: {
  value: TerritoryBounds
  onChange: (v: TerritoryBounds) => void
}) {
  return (
    <fieldset className="grid grid-cols-2 gap-3">
      <legend className="mb-2 text-sm font-medium">Geographic bounds</legend>
      {FIELDS.map((f) => {
        const id = `bounds-${f.key}`
        return (
          <div key={f.key} className="space-y-1">
            <Label htmlFor={id}>{f.label}</Label>
            <Input
              id={id}
              type="number"
              step="0.0001"
              min={f.min}
              max={f.max}
              value={value[f.key]}
              onChange={(e) => onChange({ ...value, [f.key]: Number(e.target.value) })}
            />
          </div>
        )
      })}
    </fieldset>
  )
}
