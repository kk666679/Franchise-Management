import { Card } from "@/components/ui/card"
import type { PosEndOfDayReportView } from "../types"

export type PosEndOfDayReportProps = { report: PosEndOfDayReportView }

function fmt(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100)
}

export function PosEndOfDayReport({ report }: PosEndOfDayReportProps) {
  const rows: Array<[string, number]> = [
    ["Opening float", report.openingFloatCents],
    ["Cash sales", report.cashSalesCents],
    ["Card sales", report.cardSalesCents],
    ["Other sales", report.otherSalesCents],
    ["Refunds", report.refundsCents],
    ["Expected cash", report.expectedCashCents],
    ["Counted cash", report.countedCashCents],
    ["Variance", report.varianceCents],
  ]
  return (
    <Card className="space-y-3 p-4" aria-label="End of day report">
      <h3 className="font-semibold">Z-report — {report.registerName}</h3>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="tabular-nums">{fmt(value, report.currency)}</dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}
