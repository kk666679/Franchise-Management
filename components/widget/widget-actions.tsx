"use client"

import * as React from "react"
import { MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { WidgetAction } from "./types"

export interface WidgetActionsProps {
  actions?: WidgetAction[]
  children?: React.ReactNode
  align?: "start" | "end"
  label?: string
  className?: string
}

export function WidgetActions({
  actions = [],
  children,
  align = "end",
  label = "Widget actions",
  className,
}: WidgetActionsProps) {
  if (children) {
    return <div className={cn("flex items-center gap-1", className)}>{children}</div>
  }
  if (actions.length === 0) return null

  const primary = actions.filter((a) => !a.destructive).slice(0, 2)
  const overflow = actions.filter((a) => !a.destructive).slice(2)
  const destructive = actions.filter((a) => a.destructive)

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {primary.map((action) => (
        <Button
          key={action.id}
          variant="ghost"
          size="sm"
          className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
          onClick={action.onSelect}
          disabled={action.disabled}
          aria-label={action.label}
        >
          {action.icon ? <span className="[&_svg]:size-3.5">{action.icon}</span> : null}
          <span className="hidden sm:inline">{action.label}</span>
        </Button>
      ))}
      {(overflow.length > 0 || destructive.length > 0) ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-8 text-muted-foreground hover:text-foreground"
              aria-label={label}
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={align} className="w-44">
            {overflow.map((action) => (
              <DropdownMenuItem
                key={action.id}
                onSelect={action.onSelect}
                disabled={action.disabled}
              >
                {action.icon ? <span className="[&_svg]:size-4">{action.icon}</span> : null}
                {action.label}
                {action.shortcut ? (
                  <span className="ml-auto text-xs tracking-widest text-muted-foreground">
                    {action.shortcut}
                  </span>
                ) : null}
              </DropdownMenuItem>
            ))}
            {overflow.length > 0 && destructive.length > 0 ? <DropdownMenuSeparator /> : null}
            {destructive.map((action) => (
              <DropdownMenuItem
                key={action.id}
                variant="destructive"
                onSelect={action.onSelect}
                disabled={action.disabled}
              >
                {action.icon ? <span className="[&_svg]:size-4">{action.icon}</span> : null}
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  )
}
