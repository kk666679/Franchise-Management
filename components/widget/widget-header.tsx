"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export interface WidgetHeaderComponentProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode
  description?: React.ReactNode
  eyebrow?: React.ReactNode
  icon?: React.ReactNode
  actions?: React.ReactNode
  badge?: React.ReactNode
  meta?: React.ReactNode
}

export function WidgetHeader({
  className,
  title,
  description,
  eyebrow,
  icon,
  actions,
  badge,
  meta,
  children,
  ...props
}: WidgetHeaderComponentProps) {
  return (
    <div
      data-slot="widget-header"
      className={cn(
        "flex flex-col gap-3 border-b border-border/50 px-(--widget-px) py-(--widget-py) sm:flex-row sm:items-start sm:justify-between",
        className
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-1 gap-3">
        {icon ? (
          <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15 [&_svg]:size-4">
            {icon}
          </div>
        ) : null}
        <div className="min-w-0 flex-1 space-y-1">
          {eyebrow ? (
            <p className="text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
              {eyebrow}
            </p>
          ) : null}
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            {title ? (
              <h3 className="truncate text-sm font-semibold tracking-tight text-foreground sm:text-base">
                {title}
              </h3>
            ) : null}
            {badge}
          </div>
          {description ? (
            <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>
          ) : null}
          {meta ? (
            <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-muted-foreground">
              {meta}
            </div>
          ) : null}
          {children}
        </div>
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-1.5 self-start">{actions}</div>
      ) : null}
    </div>
  )
}

export function WidgetBadge({
  className,
  variant = "outline",
  ...props
}: React.ComponentProps<typeof Badge>) {
  return (
    <Badge
      variant={variant}
      className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", className)}
      {...props}
    />
  )
}
