import type { ShiftCellProps } from './ShiftCell.types'

export function ShiftCell({ shift }: ShiftCellProps) {
  if (!shift) return <span className="text-muted-foreground text-sm">—</span>
  return <span className="text-sm">{shift.startsAtIso.slice(11,16)}–{shift.endsAtIso.slice(11,16)}</span>
}
