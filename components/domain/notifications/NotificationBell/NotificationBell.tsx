'use client'

import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { NotificationBellProps } from './NotificationBell.types'

export function NotificationBell({ unreadCount, onClick }: NotificationBellProps) {
  return (
    <Button variant="ghost" size="icon" aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`} onClick={onClick} className="relative">
      <Bell className="size-5" />
      {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] leading-4 text-center px-1">{unreadCount}</span>}
    </Button>
  )
}
