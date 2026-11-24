"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { NotificationBellProps } from "./NotificationBell.types"

export function NotificationBell({
  unreadCount,
  onClick,
}: NotificationBellProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      onClick={onClick}
      className="relative"
    >
      <Bell className="size-5" />
      {unreadCount > 0 && (
        <span className="text-destructive-foreground absolute -top-0.5 -right-0.5 h-4 min-w-4 rounded-full bg-destructive px-1 text-center text-[10px] leading-4">
          {unreadCount}
        </span>
      )}
    </Button>
  )
}
