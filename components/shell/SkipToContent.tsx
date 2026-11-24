import * as React from "react"
import { cn } from "@/lib/utils"

export function SkipToContent({
  href = "#main-content",
  className,
}: {
  href?: string
  className?: string
}) {
  return (
    <a
      href={href}
      className={cn(
        "sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:text-foreground focus:shadow",
        className
      )}
    >
      Skip to content
    </a>
  )
}
