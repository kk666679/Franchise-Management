"use client"

import * as React from "react"
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { WidgetMetric, WidgetTrendDirection } from "./types"

function TrendIcon({ trend }: { trend?: WidgetTrendDirection }) {
  if (trend === "up") return <ArrowUpRight className="size-3.5" aria-hidden="true" />
  if (trend === "down") return <ArrowDownRight className="size-3.5" aria-hidden="true" />
  return <Minus className="size-3.5" aria-hidden="true" />
}

function trendTone(trend?: WidgetTrendDirection) {
  if (trend === "up") return "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
  if (trend === "down") return "text-red-600 dark:text-red-400 bg-red-500/10"
  return "text-muted-foreground bg-muted/60"
}

export interface StatWidgetProps {
  metric: WidgetMetric
  compact?: boolean
  className?: string
}

export function StatWidget({ metric, compact = false, className }: StatWidgetProps) {
  const change = metric.change
  const changeText =
    typeof change === "number"
      ? `${change > 0 ? "+" : ""}${change.toFixed(1)}%`
      : metric.changeLabel

  const content = (
    <div
      className={cn(
        "flex h-full flex-col justify-between gap-3 rounded-2xl border border-border/50 bg-background/40 p-4 transition-colors",
        metric.href && "hover:bg-muted/30",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {metric.label}
        </p>
        {metric.icon ? (
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary [&_svg]:size-4">
            {metric.icon}
          </div>
        ) : null}
      </div>
      <div className="space-y-1.5">
        <p className={cn("font-semibold tracking-tight tabular-nums", compact ? "text-xl" : "text-2xl")}>
          {metric.value}
        </p>
        {(changeText || metric.changeLabel) ? (
          <div className="flex items-center gap-2 text-xs">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium",
                trendTone(metric.trend)
              )}
            >
              <TrendIcon trend={metric.trend} />
              {changeText}
            </span>
            {metric.changeLabel && typeof change === "number" ? (
              <span className="truncate text-muted-foreground">{metric.changeLabel}</span>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )

  if (metric.href) {
    return (
      <a href={metric.href} className="block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
        {content}
      </a>
    )
  }
  return content
}

export interface StatGridProps {
  metrics: WidgetMetric[]
  columns?: 2 | 3 | 4
  compact?: boolean
  className?: string
}

export function StatGrid({ metrics, columns = 4, compact = false, className }: StatGridProps) {
  const colClass = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
  }[columns]

  return (
    <div className={cn("grid gap-3", colClass, className)} role="list" aria-label="Metrics">
      {metrics.map((metric) => (
        <div key={metric.id} role="listitem">
          <StatWidget metric={metric} compact={compact} />
        </div>
      ))}
    </div>
  )
}
