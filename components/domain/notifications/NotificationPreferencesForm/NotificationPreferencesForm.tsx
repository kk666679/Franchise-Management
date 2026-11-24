"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import type { NotificationPreferencesFormProps } from "./NotificationPreferencesForm.types"
import type { NotificationPreferenceView } from "../mappers"

export function NotificationPreferencesForm({
  initial,
  onSave,
}: NotificationPreferencesFormProps) {
  const [prefs, setPrefs] = useState<NotificationPreferenceView[]>(initial)
  function toggle(
    channel: NotificationPreferenceView["channel"],
    enabled: boolean
  ) {
    setPrefs((prev) =>
      prev.map((p) => (p.channel === channel ? { ...p, enabled } : p))
    )
  }
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        void onSave(prefs)
      }}
    >
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Channels</legend>
        {prefs.map((p) => (
          <label key={p.channel} className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={p.enabled}
              onCheckedChange={(v) => toggle(p.channel, Boolean(v))}
            />
            {p.channel}
          </label>
        ))}
      </fieldset>
      <Button type="submit">Save preferences</Button>
    </form>
  )
}
