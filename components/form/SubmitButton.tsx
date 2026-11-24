"use client"

import { Button } from "@/components/ui/button"
import type { ComponentProps } from "react"

export function SubmitButton({
  pending,
  children,
  ...props
}: ComponentProps<typeof Button> & { pending?: boolean }) {
  return (
    <Button type="submit" disabled={pending || props.disabled} {...props}>
      {children}
    </Button>
  )
}
