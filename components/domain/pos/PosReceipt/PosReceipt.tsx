import { Card } from "@/components/ui/card"
import type { PosReceiptProps } from "./PosReceipt.types"

export function PosReceipt({ receipt }: PosReceiptProps) {
  const fmt = (cents: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: receipt.currency }).format(cents / 100)
  return (
    <Card className="space-y-3 p-4" aria-label={`Receipt ${receipt.receiptNumber}`}>
      <h3 className="font-semibold">Receipt {receipt.receiptNumber}</h3>
      <ul className="divide-y divide-border text-sm">
        {receipt.lines.map((l) => (
          <li key={l.id} className="flex justify-between py-1">
            <span>{l.name} x {l.quantity}</span>
            <span className="tabular-nums">{fmt(l.totalCents)}</span>
          </li>
        ))}
      </ul>
      <div className="space-y-1 border-t border-border pt-2 text-sm">
        {receipt.subtotalCents != null ? <div className="flex justify-between"><span>Subtotal</span><span className="tabular-nums">{fmt(receipt.subtotalCents)}</span></div> : null}
        {receipt.taxCents != null ? <div className="flex justify-between"><span>Tax</span><span className="tabular-nums">{fmt(receipt.taxCents)}</span></div> : null}
        <div className="flex justify-between font-medium"><span>Total</span><span className="tabular-nums">{fmt(receipt.totalCents)}</span></div>
      </div>
    </Card>
  )
}
