"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { PosCustomerView } from "../types"

export type PosCustomerLookupProps = {
  customer: PosCustomerView | null
  onSearch: (query: string) => Promise<void> | void
  onClear: () => void
  disabled?: boolean
}

export function PosCustomerLookup({ customer, onSearch, onClear, disabled = false }: PosCustomerLookupProps) {
  const [query, setQuery] = useState("")
  return (
    <Card className="space-y-3 p-4">
      <h3 className="font-semibold">Customer</h3>
      <div className="flex gap-2">
        <Input aria-label="Customer lookup" placeholder="Phone, email, or name" value={query} onChange={(e) => setQuery(e.target.value)} disabled={disabled} />
        <Button disabled={disabled || !query.trim()} onClick={() => void onSearch(query.trim())}>Search</Button>
      </div>
      {customer ? (
        <div className="flex items-center justify-between rounded-md border border-border p-2 text-sm">
          <div>
            <div className="font-medium">{customer.name}</div>
            <div className="text-muted-foreground">{customer.phone ?? customer.email ?? "No contact"}</div>
          </div>
          <Button size="sm" variant="ghost" onClick={onClear}>Clear</Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No customer attached.</p>
      )}
    </Card>
  )
}
