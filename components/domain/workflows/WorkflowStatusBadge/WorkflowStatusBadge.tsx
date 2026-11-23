import { Badge } from '@/components/ui/badge'
import type { WorkflowStatusBadgeProps } from './WorkflowStatusBadge.types'

const map = { pending: { label: 'Pending', variant: 'secondary' }, approved: { label: 'Approved', variant: 'default' }, rejected: { label: 'Rejected', variant: 'destructive' } } as const

export function WorkflowStatusBadge({ status }: WorkflowStatusBadgeProps) {
  const { label, variant } = map[status]
  return <Badge variant={variant} aria-label={`Workflow status: ${label}`}>{label}</Badge>
}
