"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { PosHeldOrderView } from "../types"

export type PosHeldOrdersProps = {
  orders: PosHeldOrderView[]
  onResume: (orderId: string) => void
  onDelete?: (orderId: string) => void
}

export function PosHeldOrders({ orders, onResume, onDelete }: PosHeldOrdersProps) {
  return (
    <Card className="space-y-3 p-4">
      <h3 className="font-semibold">Held orders</h3>
      {orders.length === 0 ? <p className="text-sm text-muted-foreground">No held orders.</p> : (
        <ul className="divide-y divide-border">
          {orders.map((order) => (
            <li key={order.id} className="flex items-center justify-between gap-2 py-2 text-sm">
              <div>
                <div className="font-medium">{order.label}</div>
                <div className="text-muted-foreground">{order.itemCount} items · {(order.totalCents / 100).toFixed(2)} {order.currency}</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onResume(order.id)}>Resume</Button>
                {onDelete ? <Button size="sm" variant="ghost" onClick={() => onDelete(order.id)}>Delete</Button> : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
