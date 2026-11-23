import { Card } from '@/components/ui/card'
import type { AuditDetailProps } from './AuditDetail.types'

export function AuditDetail({ event }: AuditDetailProps) {
  return (
    <Card className="p-4 space-y-3">
      <h3 className="font-semibold">Audit event</h3>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <div><dt className="text-muted-foreground">Actor</dt><dd>{event.actorName}</dd></div>
        <div><dt className="text-muted-foreground">Action</dt><dd>{event.action}</dd></div>
        <div><dt className="text-muted-foreground">Entity</dt><dd>{event.entityType} ({event.entityId})</dd></div>
        <div><dt className="text-muted-foreground">When</dt><dd>{event.occurredAtIso.slice(0,16).replace('T',' ')}</dd></div>
      </dl>
      <p className="text-sm">{event.summary}</p>
    </Card>
  )
}
