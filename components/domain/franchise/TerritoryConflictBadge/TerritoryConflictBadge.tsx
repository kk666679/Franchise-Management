import { Badge } from '@/components/ui/Badge'

export function TerritoryConflictBadge({ details }: { details?: string }) {
  return (
    <Badge
      variant="destructive"
      title={details ?? 'This territory overlaps another assigned territory'}
      aria-label="Territory conflict"
    >
      Conflict
    </Badge>
  )
}
