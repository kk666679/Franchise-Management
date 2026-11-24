"use client"

import * as React from "react"
import { cn } from "cn"
import { Progress as ProgressPrimitive } from "radix-ui"

export function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  className?: string
}) {
  return (
    <ProgressPrimitive.Root
      className={cn(
        "relative w-full overflow-hidden rounded-3xl bg-primary/20",
        className
      )}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Indicator className="flex-1 bg-primary" />
    </ProgressPrimitive.Root>
  )
}
