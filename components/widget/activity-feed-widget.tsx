"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { WidgetFeedItem } from "./types"

function statusDot(status?: WidgetFeedItem["status"]) {
  switch (status) {
    case "success":
      return "bg-emerald-500"
    case "warning":
      return "bg-amber-500"
    case "error":
      return "bg-red-500"
    case "info":
      return "bg-sky-500"
    default:
      return "bg-muted-foreground/50"
  }
}

function statusBadge(status?: WidgetFeedItem["status"]) {
  switch (status) {
    case "success":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
    case "warning":
      return "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400"
    case "error":
      return "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400"
    case "info":
      return "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-400"
    default:
      return "border-border/60 bg-muted/40 text-muted-foreground"
  }
}

function formatTimestamp(ts?: string | Date) {
  if (!ts) return null
  const date = ts instanceof Date ? ts : new Date(ts)
  if (Number.isNaN(date.getTime())) return String(ts)
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

export interface ActivityFeedWidgetProps {
  items: WidgetFeedItem[]
  maxHeight?: number
  className?: string
  emptyState?: React.ReactNode
  showTimeline?: boolean
}

export function ActivityFeedWidget({
  items,
  maxHeight = 360,
  className,
  emptyState,
  showTimeline = true,
}: ActivityFeedWidgetProps) {
  if (items.length === 0) {
    return <div className={className}>{emptyState}</div>
  }

  const list = (
    <ul className={cn("space-y-0", className)} aria-label="Activity feed">
      {items.map((item, index) => {
        const ts = formatTimestamp(item.timestamp)
        const initials = item.actor?.name
          ? item.actor.name
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()
          : null
        const inner = (
          <div className="flex gap-3 px-1 py-3">
            <div className="relative flex shrink-0 flex-col items-center">
              {item.actor ? (
                <Avatar size="sm" className="size-8 ring-1 ring-border/60">
                  {item.actor.avatarUrl ? <AvatarImage src={item.actor.avatarUrl} alt="" /> : null}
                  <AvatarFallback className="text-[10px]">{initials ?? "?"}</AvatarFallback>
                </Avatar>
              ) : (
                <span
                  className={cn("mt-1.5 size-2.5 rounded-full ring-2 ring-background", statusDot(item.status))}
                  aria-hidden="true"
                />
              )}
              {showTimeline && index < items.length - 1 ? (
                <span className="mt-2 w-px flex-1 bg-border/60" aria-hidden="true" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1 space-y-1 pb-1">
              <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                <p className="text-sm leading-snug font-medium text-foreground">{item.title}</p>
                <div className="flex shrink-0 items-center gap-2">
                  {item.status ? (
                    <Badge variant="outline" className={cn("px-1.5 py-0 text-[10px]", statusBadge(item.status))}>
                      {item.status}
                    </Badge>
                  ) : null}
                  {ts ? <time className="text-xs whitespace-nowrap text-muted-foreground">{ts}</time> : null}
                </div>
              </div>
              {item.description ? (
                <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
              ) : null}
              {(item.actor?.name || item.meta) ? (
                <p className="text-xs text-muted-foreground/80">
                  {[item.actor?.name, item.meta].filter(Boolean).join(" · ")}
                </p>
              ) : null}
            </div>
          </div>
        )

        return (
          <li key={item.id} className="border-b border-border/40 last:border-b-0">
            {item.href ? (
              <a href={item.href} className="block rounded-lg outline-none transition-colors hover:bg-muted/30 focus-visible:ring-2 focus-visible:ring-ring/40">
                {inner}
              </a>
            ) : (
              inner
            )}
          </li>
        )
      })}
    </ul>
  )

  return (
    <ScrollArea style={{ maxHeight }} className="pr-3">
      {list}
    </ScrollArea>
  )
}
