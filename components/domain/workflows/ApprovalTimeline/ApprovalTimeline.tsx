import type { ApprovalTimelineProps } from './ApprovalTimeline.types'

export function ApprovalTimeline({ steps }: ApprovalTimelineProps) {
  return (
    <ol className="space-y-3" aria-label="Approval timeline">
      {steps.map((s) => (
        <li key={s.id} className="flex items-start gap-3 text-sm">
          <span className={['mt-1 size-2 rounded-full', s.status === 'done' ? 'bg-green-500' : s.status === 'rejected' ? 'bg-destructive' : s.status === 'active' ? 'bg-primary' : 'bg-muted-foreground/40'].join(' ')} />
          <div><div className="font-medium">{s.label}</div><div className="text-muted-foreground">{s.actorName ?? 'Pending'}{s.actedAtIso ? ` · ${s.actedAtIso.slice(0,10)}` : ''}</div></div>
        </li>
      ))}
      {steps.length === 0 && <li className="text-sm text-muted-foreground">No steps.</li>}
    </ol>
  )
}
