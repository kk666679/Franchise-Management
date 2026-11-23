import { Card } from '@/components/ui/card'
import type { PosReceiptProps } from './PosReceipt.types'

export function PosReceipt({ receipt }: PosReceiptProps) {
  const fmt = (cents: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency: receipt.currency }).format(cents / 100)
  return (
    <Card className="p-4 space-y-3">
      <h3 className="font-semibold">Receipt {receipt.receiptNumber}</h3>
      <ul className="text-sm divide-y divide-border">
        {receipt.lines.map((l) => (
          <li key={l.id} className="py-1 flex justify-between"><span>{l.name} x {l.quantity}</span><span className="tabular-nums">{fmt(l.totalCents)}</span></li>
        ))}
      </ul>
      <div className="flex justify-between font-medium text-sm pt-2 border-t border-border"><span>Total</span><span className="tabular-nums">{fmt(receipt.totalCents)}</span></div>
    </Card>
  )
}
