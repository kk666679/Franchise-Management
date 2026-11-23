import { Badge } from '@/components/ui/badge'
import type { StockLevelBadgeProps } from './StockLevelBadge.types'

export function StockLevelBadge({ onHand, reorderPoint }: StockLevelBadgeProps) {
  const low = onHand <= reorderPoint
  return <Badge variant={low ? 'destructive' : 'secondary'} aria-label={`Stock level: ${low ? 'Low' : 'OK'}`}>{low ? 'Low stock' : 'In stock'}</Badge>
}
