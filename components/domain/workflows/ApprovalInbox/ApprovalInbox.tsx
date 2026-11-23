import { Card } from '@/components/ui/card'
import { ApprovalCard } from '../ApprovalCard'
import type { ApprovalInboxProps } from './ApprovalInbox.types'

export function ApprovalInbox({ approvals, onDecision }: ApprovalInboxProps) {
  return (
    <Card className="p-4 space-y-3">
      <h3 className="font-semibold">Approval inbox</h3>
      {approvals.length === 0 ? <p className="text-sm text-muted-foreground">No pending approvals.</p> : (
        <ul className="space-y-3">{approvals.map((a) => <li key={a.id}><ApprovalCard approval={a} onDecision={onDecision} /></li>)}</ul>
      )}
    </Card>
  )
}
