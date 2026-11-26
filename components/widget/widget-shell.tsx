"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import type { WidgetSize, WidgetStatus, WidgetDensity } from "./types"

const widgetShellVariants = cva(
  "group/widget relative flex min-w-0 flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/80 text-card-foreground shadow-sm backdrop-blur-sm transition-[box-shadow,transform,border-color,background-color] duration-200",
  {
    variants: {
      size: {
        sm: "col-span-12 sm:col-span-6 xl:col-span-3",
        md: "col-span-12 sm:col-span-6 xl:col-span-4",
        lg: "col-span-12 xl:col-span-6",
        xl: "col-span-12 xl:col-span-8",
        full: "col-span-12",
      },
      density: {
        comfortable: "[--widget-gap:1rem] [--widget-px:1.25rem] [--widget-py:1.125rem]",
        compact: "[--widget-gap:0.75rem] [--widget-px:1rem] [--widget-py:0.875rem]",
      },
      interactive: {
        true: "hover:border-border hover:shadow-md focus-within:ring-2 focus-within:ring-ring/40",
        false: "",
      },
      selected: {
        true: "border-primary/50 ring-2 ring-primary/30",
        false: "",
      },
      status: {
        default: "",
        loading: "pointer-events-none",
        empty: "",
        error: "border-destructive/30",
        success: "border-emerald-500/25",
        warning: "border-amber-500/25",
      },
    },
    defaultVariants: {
      size: "md",
      density: "comfortable",
      interactive: false,
      selected: false,
      status: "default",
    },
  }
)

export interface WidgetShellComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof widgetShellVariants> {
  asChild?: boolean
}

export function WidgetShell({
  className,
  size,
  density,
  interactive,
  selected,
  status,
  ...props
}: WidgetShellComponentProps) {
  return (
    <section
      data-slot="widget-shell"
      data-size={size ?? "md"}
      data-status={status ?? "default"}
      data-density={density ?? "comfortable"}
      aria-busy={status === "loading" || undefined}
      className={cn(
        widgetShellVariants({ size, density, interactive, selected, status }),
        className
      )}
      {...props}
    />
  )
}

export { widgetShellVariants }
