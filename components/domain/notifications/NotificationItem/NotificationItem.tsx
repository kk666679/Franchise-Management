"use client"

import { Button } from "@/components/ui/button"
import type { NotificationItemProps } from "./NotificationItem.types"

export function NotificationItem({
  notification,
  onMarkRead,
}: NotificationItemProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p
          className={[
            "text-sm",
            notification.read ? "text-muted-foreground" : "font-medium",
          ].join(" ")}
        >
          {notification.title}
        </p>
        <p className="text-xs text-muted-foreground">{notification.body}</p>
      </div>
      {!notification.read && onMarkRead && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onMarkRead(notification.id)}
        >
          Mark read
        </Button>
      )}
    </div>
  )
}
