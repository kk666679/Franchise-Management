import { Badge } from '@/components/ui/badge'
import type { ContractStatus } from './ContractLifecycleBadge.types'

const label: Record<ContractStatus, string> = {
  draft: 'Draft',
  pending_approval: 'Pending approval',
  active: 'Active',
  renewal: 'Renewal',
  terminated: 'Terminated',
  expired: 'Expired',
}

const tone: Record<ContractStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  draft: 'outline',
  pending_approval: 'secondary',
  active: 'default',
  renewal: 'secondary',
  terminated: 'destructive',
  expired: 'destructive',
}

export function ContractLifecycleBadge({ status }: { status: ContractStatus }) {
  return (
    <Badge variant={tone[status]} aria-label={`Contract status: ${label[status]}`}>
      {label[status]}
    </Badge>
  )
}
