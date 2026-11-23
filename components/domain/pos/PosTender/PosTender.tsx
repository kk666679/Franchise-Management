'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { PosTenderProps } from './PosTender.types'

export function PosTender({ items, onTender }: PosTenderProps) {
  const disabled = items.length === 0
  return (
    <Card className="p-4 space-y-3">
      <h3 className="font-semibold">Tender</h3>
      <div className="flex gap-2">
        <Button className="flex-1" disabled={disabled} onClick={() => void onTender('cash')}>Cash</Button>
        <Button className="flex-1" variant="outline" disabled={disabled} onClick={() => void onTender('card')}>Card</Button>
      </div>
    </Card>
  )
}
