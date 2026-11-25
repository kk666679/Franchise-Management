"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { PosTenderProps } from "./PosTender.types"

export function PosTender({ items, onTender, disabled = false, methods = ["cash", "card"] }: PosTenderProps) {
  const isDisabled = disabled || items.length === 0
  const label: Record<string, string> = { cash: "Cash", card: "Card", softpos: "SoftPOS", wallet: "Wallet", other: "Other" }
  return (
    <Card className="space-y-3 p-4">
      <h3 className="font-semibold">Tender</h3>
      <div className="flex flex-wrap gap-2">
        {methods.map((method) => (
          <Button
            key={method}
            className="flex-1"
            variant={method === "cash" ? "default" : "outline"}
            disabled={isDisabled}
            onClick={() => void onTender(method as "cash" | "card")}
          >
            {label[method] ?? method}
          </Button>
        ))}
      </div>
    </Card>
  )
}
