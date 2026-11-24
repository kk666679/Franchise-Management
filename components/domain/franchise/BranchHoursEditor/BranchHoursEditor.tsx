"use client"

import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { DaySchedule, WeekSchedule } from "./BranchHoursEditor.types"

const DAYS: { key: keyof WeekSchedule; label: string }[] = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
]

export function BranchHoursEditor({
  value,
  onChange,
}: {
  value: WeekSchedule
  onChange: (v: WeekSchedule) => void
}) {
  function update(key: keyof WeekSchedule, patch: Partial<DaySchedule>) {
    onChange({ ...value, [key]: { ...value[key], ...patch } })
  }

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium">Operating hours</legend>
      {DAYS.map(({ key, label }) => {
        const d = value[key]
        const id = `hours-${key}`
        return (
          <div
            key={key}
            className="grid grid-cols-[120px_1fr_1fr_auto] items-center gap-3"
          >
            <Label htmlFor={id}>{label}</Label>
            <Input
              id={id}
              type="time"
              value={d.open}
              disabled={d.closed}
              onChange={(e) => update(key, { open: e.target.value })}
              aria-label={`${label} open time`}
            />
            <Input
              type="time"
              value={d.close}
              disabled={d.closed}
              onChange={(e) => update(key, { close: e.target.value })}
              aria-label={`${label} close time`}
            />
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={d.closed}
                onCheckedChange={(c) => update(key, { closed: Boolean(c) })}
              />
              Closed
            </label>
          </div>
        )
      })}
    </fieldset>
  )
}
