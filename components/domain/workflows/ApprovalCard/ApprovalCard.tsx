'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { WorkflowStatusBadge } from '../WorkflowStatusBadge'
import type { ApprovalCardProps } from './ApprovalCard.types'

export function ApprovalCard({ approval, onDecision }: ApprovalCardProps) {
  return (
    <Card className="p-4 space-y-2">
      <div className="flex items-center justify-between gap-2"><h4 className="font-medium">{approval.title}</h4><WorkflowStatusBadge status={approval.status} /></div>
      <p className="text-sm text-muted-foreground">{approval.summary}</p>
      <div className="text-xs text-muted-foreground">Requested by {approval.requesterName}</div>
      {approval.status === 'pending' && onDecision && (
        <div className="flex gap-2 pt-2">
          <Button size="sm" onClick={() => void onDecision(approval.id, 'approved')}>Approve</Button>
          <Button size="sm" variant="outline" onClick={() => void onDecision(approval.id, 'rejected')}>Reject</Button>
        </div>
      )}
    </Card>
  )
}
