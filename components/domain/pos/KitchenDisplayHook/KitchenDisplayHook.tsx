"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export type KitchenDisplayHookProps = {
  enabled: boolean
  onChange: (enabled: boolean) => void
  disabled?: boolean
}

export function KitchenDisplayHook({ enabled, onChange, disabled = false }: KitchenDisplayHookProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border p-3">
      <div>
        <Label htmlFor="kitchen-routing" className="font-medium">Kitchen routing</Label>
        <p className="text-xs text-muted-foreground">Send eligible items to kitchen display.</p>
      </div>
      <Switch id="kitchen-routing" checked={enabled} onCheckedChange={onChange} disabled={disabled} aria-label="Kitchen routing" />
    </div>
  )
}
