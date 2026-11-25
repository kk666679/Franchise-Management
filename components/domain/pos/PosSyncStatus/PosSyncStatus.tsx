import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { PosOutboxEntryView } from "../types"

export type PosSyncStatusProps = { entries: PosOutboxEntryView[] }

const tone: Record<PosOutboxEntryView["status"], "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  syncing: "secondary",
  synced: "default",
  failed: "destructive",
  conflict: "destructive",
}

export function PosSyncStatus({ entries }: PosSyncStatusProps) {
  return (
    <Card className="space-y-3 p-4" aria-label="POS sync status">
      <h3 className="font-semibold">Sync status</h3>
      <ul className="space-y-2">
        {entries.map((e) => (
          <li key={e.id} className="flex items-center justify-between gap-2 text-sm">
            <span className="truncate font-mono text-xs">{e.clientOpId}</span>
            <div className="flex items-center gap-2">
              {e.retryCount > 0 ? <span className="text-xs text-muted-foreground">retry {e.retryCount}</span> : null}
              <Badge variant={tone[e.status]}>{e.status}</Badge>
            </div>
          </li>
        ))}
        {entries.length === 0 ? <li className="text-sm text-muted-foreground">No outbox entries.</li> : null}
      </ul>
    </Card>
  )
}
