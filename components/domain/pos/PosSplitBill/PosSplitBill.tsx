"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { PosCartItemView } from "../types"

export type PosSplitGroup = { id: string; label: string; itemIds: string[] }

export type PosSplitBillProps = {
  items: PosCartItemView[]
  groups: PosSplitGroup[]
  onAssign: (itemId: string, groupId: string) => void
  onCreateGroup: () => void
}

export function PosSplitBill({ items, groups, onAssign, onCreateGroup }: PosSplitBillProps) {
  return (
    <Card className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Split bill</h3>
        <Button size="sm" variant="outline" onClick={onCreateGroup}>Add split</Button>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
            <span>{item.name} × {item.quantity}</span>
            <div className="flex flex-wrap gap-1">
              {groups.map((g) => (
                <Button key={g.id} size="sm" variant={g.itemIds.includes(item.id) ? "default" : "outline"} onClick={() => onAssign(item.id, g.id)}>
                  {g.label}
                </Button>
              ))}
            </div>
          </li>
        ))}
        {items.length === 0 ? <li className="text-sm text-muted-foreground">No items to split.</li> : null}
      </ul>
    </Card>
  )
}
