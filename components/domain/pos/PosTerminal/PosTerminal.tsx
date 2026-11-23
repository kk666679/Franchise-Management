'use client'

import { Card } from '@/components/ui/card'
import { PosProductSearch } from '../PosProductSearch'
import { PosCart } from '../PosCart'
import { PosTender } from '../PosTender'
import type { PosTerminalProps } from './PosTerminal.types'

export function PosTerminal({ products, cart, onAdd, onQtyChange, onRemove, onTender }: PosTerminalProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <Card className="p-4 space-y-4">
        <h2 className="font-semibold">Products</h2>
        <PosProductSearch products={products} onSelect={onAdd} />
      </Card>
      <div className="space-y-4">
        <PosCart items={cart} onQtyChange={onQtyChange} onRemove={onRemove} />
        <PosTender items={cart} onTender={onTender} />
      </div>
    </div>
  )
}
