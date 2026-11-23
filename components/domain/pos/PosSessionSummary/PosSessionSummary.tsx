import { Card } from '@/components/ui/card'
import type { PosSessionSummaryProps } from './PosSessionSummary.types'

export function PosSessionSummary({ session }: PosSessionSummaryProps) {
  const fmt = (cents: number | null) => cents == null ? '—' : new Intl.NumberFormat(undefined, { style: 'currency', currency: session.currency }).format(cents / 100)
  return (
    <Card className="p-4 space-y-2">
      <h3 className="font-semibold">Session summary</h3>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <div><dt className="text-muted-foreground">Opened</dt><dd>{session.openedAtIso.slice(0, 16).replace('T', ' ')}</dd></div>
        <div><dt className="text-muted-foreground">Closed</dt><dd>{session.closedAtIso ? session.closedAtIso.slice(0, 16).replace('T', ' ') : '—'}</dd></div>
        <div><dt className="text-muted-foreground">Opening float</dt><dd className="tabular-nums">{fmt(session.openingFloatCents)}</dd></div>
        <div><dt className="text-muted-foreground">Closing total</dt><dd className="tabular-nums">{fmt(session.closingTotalCents)}</dd></div>
      </dl>
    </Card>
  )
}
