import { FormattedDate } from "@/components/common/FormattedDate"
import type { ContractStatus } from "../ContractLifecycleBadge"

export type TimelineEvent = {
  id: string
  status: ContractStatus
  atIso: string
  actor: string
  note?: string
}

export function ContractTimeline({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) {
    return <p className="text-muted">No events recorded yet.</p>
  }
  return (
    <ol
      className="relative space-y-6 border-l pl-6"
      aria-label="Contract history"
    >
      {events.map((e) => (
        <li key={e.id} className="relative">
          <span
            className="absolute top-1 -left-[31px] h-3 w-3 rounded-full bg-primary"
            aria-hidden="true"
          />
          <p className="text-sm font-medium">
            {e.status.replace("_", " ")} · <FormattedDate iso={e.atIso} />
          </p>
          <p className="text-sm text-muted">by {e.actor}</p>
          {e.note && <p className="mt-1 text-sm">{e.note}</p>}
        </li>
      ))}
    </ol>
  )
}
