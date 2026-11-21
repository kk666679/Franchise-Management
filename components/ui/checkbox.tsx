import * as React from "react"

import { cn } from "@/lib/utils"

export type CheckboxProps = Omit<React.ComponentProps<"input">, "type"> & {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { className, checked, defaultChecked, onCheckedChange, onChange, ...props },
  ref,
) {
  return (
    <input
      {...props}
      aria-checked={checked}
      className={cn("size-4 accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}
      checked={checked}
      defaultChecked={defaultChecked}
      onChange={(event) => {
        onChange?.(event)
        onCheckedChange?.(event.currentTarget.checked)
      }}
      ref={ref}
      type="checkbox"
    />
  )
})
