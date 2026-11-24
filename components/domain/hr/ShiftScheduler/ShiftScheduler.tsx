import { Card } from "@/components/ui/card"
import type { ShiftSchedulerProps } from "./ShiftScheduler.types"

export function ShiftScheduler({ shifts }: ShiftSchedulerProps) {
  return (
    <Card className="space-y-3 p-4">
      <h3 className="font-semibold">Shift schedule</h3>
      {shifts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No shifts scheduled.</p>
      ) : (
        <ul className="divide-y divide-border">
          {shifts.map((s) => (
            <li key={s.id} className="flex justify-between py-2 text-sm">
              <span>
                {s.employeeName} — {s.role}
              </span>
              <span className="text-muted-foreground">
                {s.startsAtIso.slice(11, 16)}–{s.endsAtIso.slice(11, 16)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
