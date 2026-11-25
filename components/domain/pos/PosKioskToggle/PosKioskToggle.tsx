"use client"

import { Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export type PosKioskToggleProps = {
  active: boolean
  onToggle: (next: boolean) => void
  disabled?: boolean
}

export function PosKioskToggle({ active, onToggle, disabled = false }: PosKioskToggleProps) {
  const Icon = active ? Minimize2 : Maximize2
  const label = active ? "Exit kiosk mode" : "Enter kiosk mode"
  return (
    <Button variant="outline" disabled={disabled} onClick={() => onToggle(!active)} aria-pressed={active}>
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </Button>
  )
}
