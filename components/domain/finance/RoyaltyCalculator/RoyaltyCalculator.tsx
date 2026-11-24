"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import type { RoyaltyCalculatorProps } from "./RoyaltyCalculator.types"

export function RoyaltyCalculator({
  defaultRateBps = 500,
  currency = "USD",
}: RoyaltyCalculatorProps) {
  const [grossSales, setGrossSales] = useState(0)
  const [rateBps, setRateBps] = useState(defaultRateBps)
  const royalty = useMemo(
    () => Math.round(grossSales * (rateBps / 10000)),
    [grossSales, rateBps]
  )
  const fmt = (cents: number) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency }).format(
      cents / 100
    )
  return (
    <Card className="space-y-4 p-4">
      <h3 className="font-semibold">Royalty calculator</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="gross-sales">Gross sales (cents)</Label>
          <Input
            id="gross-sales"
            type="number"
            min={0}
            value={grossSales}
            onChange={(e) => setGrossSales(Number(e.target.value))}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="royalty-rate">Rate (bps)</Label>
          <Input
            id="royalty-rate"
            type="number"
            min={0}
            value={rateBps}
            onChange={(e) => setRateBps(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        Royalty due:{" "}
        <span className="font-medium text-foreground tabular-nums">
          {fmt(royalty)}
        </span>
      </div>
    </Card>
  )
}
