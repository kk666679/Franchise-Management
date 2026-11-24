"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { PosTenderProps } from "./PosTender.types"

export function PosTender({ items, onTender, disabled = false }: PosTenderProps) {
  const isDisabled = disabled || items.length === 0
  return (
    <Card className="space-y-3 p-4">
      <h3 className="font-semibold">Tender</h3>
      <div className="flex gap-2">
        <Button
          className="flex-1"
          disabled={isDisabled}
          onClick={() => void onTender("cash")}
        >
          Cash
        </Button>
        <Button
          className="flex-1"
          variant="outline"
          disabled={isDisabled}
          onClick={() => void onTender("card")}
        >
          Card
        </Button>
      </div>
    </Card>
  )
}
