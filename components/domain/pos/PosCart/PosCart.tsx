"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { PosCartProps } from "./PosCart.types"

export function PosCart({ items, onQtyChange, onRemove }: PosCartProps) {
  const total = items.reduce((s, i) => s + i.quantity * i.unitPriceCents, 0)
  const currency = items[0]?.currency ?? "USD"
  const fmt = (cents: number) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency }).format(
      cents / 100
    )
  return (
    <Card className="space-y-3 p-4">
      <h3 className="font-semibold">Cart</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Cart is empty.</p>
      ) : (
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-2 py-2 text-sm"
            >
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-muted-foreground">
                  {fmt(item.unitPriceCents)} x {item.quantity}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  aria-label={`Decrease ${item.name}`}
                  onClick={() =>
                    onQtyChange(item.id, Math.max(1, item.quantity - 1))
                  }
                >
                  -
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  aria-label={`Increase ${item.name}`}
                  onClick={() => onQtyChange(item.id, item.quantity + 1)}
                >
                  +
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemove(item.id)}
                >
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-between text-sm font-medium">
        <span>Total</span>
        <span className="tabular-nums">{fmt(total)}</span>
      </div>
    </Card>
  )
}
