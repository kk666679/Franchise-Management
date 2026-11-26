"use client"

import * as React from "react"
import { AlertTriangle, Inbox, RefreshCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export function WidgetSkeleton({
  lines = 3,
  className,
  showHeader = true,
}: {
  lines?: number
  className?: string
  showHeader?: boolean
}) {
  return (
    <div className={cn("flex flex-col gap-(--widget-gap)", className)} aria-hidden="true">
      {showHeader ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-44 max-w-full" />
        </div>
      ) : null}
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn("h-10 w-full rounded-xl", i === lines - 1 && "w-4/5")}
          />
        ))}
      </div>
    </div>
  )
}

export function WidgetEmptyState({
  icon = <Inbox className="size-5" />,
  title = "No data yet",
  description,
  action,
  className,
}: {
  icon?: React.ReactNode
  title?: string
  description?: string
  action?: { label: string; onClick: () => void }
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex min-h-36 flex-col items-center justify-center gap-3 py-6 text-center",
        className
      )}
      role="status"
    >
      <div className="flex size-11 items-center justify-center rounded-2xl bg-muted/70 text-muted-foreground ring-1 ring-border/50">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description ? (
          <p className="mx-auto max-w-xs text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? (
        <Button size="sm" variant="outline" className="mt-1" onClick={action.onClick}>
          {action.label}
        </Button>
      ) : null}
    </div>
  )
}

export function WidgetErrorState({
  title = "Unable to load widget",
  message = "Something went wrong while loading this data.",
  onRetry,
  className,
}: {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex min-h-36 flex-col items-center justify-center gap-3 py-6 text-center",
        className
      )}
      role="alert"
    >
      <div className="flex size-11 items-center justify-center rounded-2xl bg-destructive/10 text-destructive ring-1 ring-destructive/20">
        <AlertTriangle className="size-5" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mx-auto max-w-xs text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry ? (
        <Button size="sm" variant="outline" className="mt-1 gap-1.5" onClick={onRetry}>
          <RefreshCcw className="size-3.5" />
          Retry
        </Button>
      ) : null}
    </div>
  )
}
