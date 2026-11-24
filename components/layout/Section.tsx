import * as React from "react"
import { cn } from "@/lib/utils"

export function Section({
  title,
  description,
  actions,
  className,
  children,
}: {
  title?: string
  description?: string
  actions?: React.ReactNode
  className?: string
  children?: React.ReactNode
}) {
  return (
    <section className={cn("space-y-4", className)}>
      {title || description || actions ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title ? (
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {actions}
            </div>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  )
}
