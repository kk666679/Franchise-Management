import * as React from "react"
import { cn } from "cn"

export function Label({
  className,
  htmlFor,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("block text-sm font-medium text-foreground", className)}
      {...props}
    />
  )
}
