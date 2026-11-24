import { Card } from "@/components/ui/card"
import type { InvoiceDetailProps } from "./InvoiceDetail.types"

export function InvoiceDetail({ invoice }: InvoiceDetailProps) {
  const total = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: invoice.currency,
  }).format(invoice.totalCents / 100)
  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Invoice {invoice.number}</h2>
        <span className="text-sm text-muted-foreground">{invoice.status}</span>
      </div>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-muted-foreground">Franchise</dt>
          <dd>{invoice.franchiseName}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Total</dt>
          <dd className="tabular-nums">{total}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Issued</dt>
          <dd>{invoice.issuedAtIso?.slice(0, 10) ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Due</dt>
          <dd>{invoice.dueDateIso.slice(0, 10)}</dd>
        </div>
      </dl>
    </Card>
  )
}
