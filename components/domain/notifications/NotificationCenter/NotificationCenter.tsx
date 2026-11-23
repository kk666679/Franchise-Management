import { Card } from '@/components/ui/card'
import { NotificationItem } from '../NotificationItem'
import type { NotificationCenterProps } from './NotificationCenter.types'

export function NotificationCenter({ notifications, onMarkRead }: NotificationCenterProps) {
  return (
    <Card className="p-4 space-y-3">
      <h3 className="font-semibold">Notifications</h3>
      {notifications.length === 0 ? <p className="text-sm text-muted-foreground">No notifications.</p> : (
        <ul className="divide-y divide-border">
          {notifications.map((n) => <li key={n.id} className="py-2"><NotificationItem notification={n} onMarkRead={onMarkRead} /></li>)}
        </ul>
      )}
    </Card>
  )
}
