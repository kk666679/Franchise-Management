"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type ToolbarAction =
  | "add-chart"
  | "add-table"
  | "add-stats"
  | "add-feed"
  | "remove"
  | "reset-layout"
  | "save-layout"

export interface WidgetToolbarProps {
  onAction: (action: ToolbarAction) => void
  selectedWidget?: string
  canRemove?: boolean
  className?: string
}

const ADD_ACTIONS: {
  label: string
  action: ToolbarAction
}[] = [
  { label: "Chart", action: "add-chart" },
  { label: "Table", action: "add-table" },
  { label: "Stats", action: "add-stats" },
  { label: "Feed", action: "add-feed" },
]

export function WidgetToolbar({
  onAction,
  selectedWidget,
  canRemove = true,
  className,
}: WidgetToolbarProps) {
  const hasSelection = Boolean(selectedWidget)

  const handleAction = (action: ToolbarAction) => {
    onAction(action)
  }

  return (
    <div
      role="toolbar"
      aria-label="Dashboard widget controls"
      className={cn(
        "flex flex-col gap-2 border-b border-border pb-3",
        "sm:flex-row sm:flex-wrap sm:items-center",
        className
      )}
    >
      {/* Add Widget Actions */}
      <div className="flex flex-1 flex-wrap gap-2">
        {ADD_ACTIONS.map(({ label, action }) => (
          <button
            key={action}
            type="button"
            onClick={() => handleAction(action)}
            className={cn(
              "flex-1 rounded-md border border-border",
              "bg-popover px-3 py-2 text-sm font-medium",
              "text-foreground-strong transition-colors",
              "hover:bg-popover-hover",
              "focus-visible:ring-2 focus-visible:outline-none",
              "focus-visible:ring-primary focus-visible:ring-offset-2",
              "dark:border-dark dark:text-dark"
            )}
          >
            Add {label}
          </button>
        ))}
      </div>

      {/* Selected Widget Actions */}
      {hasSelection && (
        <div className="flex flex-wrap gap-2 sm:ml-auto">
          {canRemove && (
            <button
              type="button"
              onClick={() => handleAction("remove")}
              className={cn(
                "border-error/20 flex-1 rounded-md border",
                "text-error px-3 py-2 text-sm font-medium",
                "hover:bg-error/10 transition-colors",
                "focus-visible:ring-2 focus-visible:outline-none",
                "focus-visible:ring-error"
              )}
            >
              Remove
            </button>
          )}

          <button
            type="button"
            onClick={() => handleAction("reset-layout")}
            className={cn(
              "border-warning/20 flex-1 rounded-md border",
              "text-warning px-3 py-2 text-sm font-medium",
              "hover:bg-warning/10 transition-colors",
              "focus-visible:ring-2 focus-visible:outline-none",
              "focus-visible:ring-warning"
            )}
          >
            Reset Layout
          </button>

          <button
            type="button"
            onClick={() => handleAction("save-layout")}
            className={cn(
              "flex-1 rounded-md border border-primary/20",
              "px-3 py-2 text-sm font-medium text-primary",
              "transition-colors hover:bg-primary/10",
              "focus-visible:ring-2 focus-visible:outline-none",
              "focus-visible:ring-primary"
            )}
          >
            Save Layout
          </button>
        </div>
      )}
    </div>
  )
}
