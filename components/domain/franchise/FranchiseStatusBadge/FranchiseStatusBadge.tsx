import { Badge } from '@/components/ui/badge'
import type { FranchiseStatus } from './FranchiseStatusBadge.types'

const label: Record<FranchiseStatus, string> = {
  draft: 'Draft',
  active: 'Active',
  suspended: 'Suspended',
  terminated: 'Terminated',
}

const tone: Record<FranchiseStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  draft: 'outline',
  active: 'default',
  suspended: 'secondary',
  terminated: 'destructive',
}

export function FranchiseStatusBadge({ status }: { status: FranchiseStatus }) {
  return (
    <Badge variant={tone[status]} aria-label={`Franchise status: ${label[status]}`}>
      {label[status]}
    </Badge>
  )
}
