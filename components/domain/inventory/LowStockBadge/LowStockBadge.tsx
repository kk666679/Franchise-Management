import { Badge } from '@/components/ui/badge'
import type { LowStockBadgeProps } from './LowStockBadge.types'

export function LowStockBadge({ count }: LowStockBadgeProps) {
  if (count <= 0) return null
  return <Badge variant="destructive" aria-label={`Low stock items: ${count}`}>{count} low</Badge>
}
