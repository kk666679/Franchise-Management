'use client'

import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { PosProductSearchProps } from './PosProductSearch.types'

export function PosProductSearch({ products, onSelect }: PosProductSearchProps) {
  const [q, setQ] = useState('')
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return products
    return products.filter((p) => p.name.toLowerCase().includes(needle) || p.sku.toLowerCase().includes(needle))
  }, [products, q])
  return (
    <div className="space-y-3">
      <Input aria-label="Search products" placeholder="Search by name or SKU" value={q} onChange={(e) => setQ(e.target.value)} />
      <ul className="divide-y divide-border rounded-md border border-border max-h-80 overflow-auto">
        {filtered.map((p) => (
          <li key={p.id} className="flex items-center justify-between p-2 text-sm">
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-muted-foreground">{p.sku}</div>
            </div>
            <Button size="sm" variant="outline" onClick={() => onSelect(p)}>Add</Button>
          </li>
        ))}
        {filtered.length === 0 && <li className="p-2 text-sm text-muted-foreground">No products found.</li>}
      </ul>
    </div>
  )
}
