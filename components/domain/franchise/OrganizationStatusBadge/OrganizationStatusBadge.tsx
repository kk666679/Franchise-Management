import { Badge } from '@/components/ui/badge'
import type { OrganizationStatus } from './OrganizationStatusBadge.types'

const label: Record<OrganizationStatus, string> = {
  active: 'Active',
  suspended: 'Suspended',
  terminated: 'Terminated',
}

const tone: Record<OrganizationStatus, 'default' | 'secondary' | 'destructive'> = {
  active: 'default',
  suspended: 'secondary',
  terminated: 'destructive',
}

export function OrganizationStatusBadge({ status }: { status: OrganizationStatus }) {
  return (
    <Badge variant={tone[status]} aria-label={`Organization status: ${label[status]}`}>
      {label[status]}
    </Badge>
  )
}
