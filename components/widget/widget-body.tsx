"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface WidgetContentComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  bleed?: boolean
}

export function WidgetContent({
  className,
  bleed = false,
  ...props
}: WidgetContentComponentProps) {
  return (
    <div
      data-slot="widget-content"
      className={cn(
        "flex-1 min-h-0",
        bleed ? "p-0" : "px-(--widget-px) py-(--widget-py)",
        className
      )}
      {...props}
    />
  )
}

export interface WidgetFooterComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  justify?: "start" | "between" | "end"
}

export function WidgetFooter({
  className,
  justify = "between",
  ...props
}: WidgetFooterComponentProps) {
  const justifyClass = {
    start: "justify-start",
    between: "justify-between",
    end: "justify-end",
  }[justify]
  return (
    <div
      data-slot="widget-footer"
      className={cn(
        "flex items-center gap-2 border-t border-border/50 px-(--widget-px) py-3 text-xs text-muted-foreground",
        justifyClass,
        className
      )}
      {...props}
    />
  )
}
