"use client"

import { useCallback, useEffect, useState } from "react"
import type { WidgetKind } from "@/lib/widget-metadata"
import { ROLE_DEFAULT_LAYOUTS } from "@/lib/widget-metadata"

export type WidgetItem = { id: string; kind: WidgetKind }

type LayoutState = { widgets: WidgetItem[] }

function storageKey(role: string) {
  return `widget-layout:${role}`
}

export function useWidgetLayout(role: string) {
  const defaultWidgets: WidgetItem[] = (ROLE_DEFAULT_LAYOUTS[role] ?? ROLE_DEFAULT_LAYOUTS.VIEWER).map(
    (kind, i) => ({ id: `${kind}-${i}`, kind }),
  )

  const [widgets, setWidgets] = useState<WidgetItem[]>(defaultWidgets)
  const [editMode, setEditMode] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // Load persisted layout once on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey(role))
      if (saved) {
        const parsed: LayoutState = JSON.parse(saved)
        if (Array.isArray(parsed.widgets) && parsed.widgets.length > 0) {
          setWidgets(parsed.widgets)
        }
      }
    } catch {
      // ignore corrupt storage
    }
    setLoaded(true)
  }, [role])

  const save = useCallback(
    (next: WidgetItem[]) => {
      try {
        localStorage.setItem(storageKey(role), JSON.stringify({ widgets: next }))
      } catch {
        // ignore storage errors
      }
    },
    [role],
  )

  const removeWidget = useCallback(
    (id: string) => {
      setWidgets((prev) => {
        const next = prev.filter((w) => w.id !== id)
        save(next)
        return next
      })
    },
    [save],
  )

  const resetLayout = useCallback(() => {
    setWidgets(defaultWidgets)
    save(defaultWidgets)
  }, [defaultWidgets, save])

  const toggleEditMode = useCallback(() => setEditMode((v) => !v), [])

  return { widgets, editMode, loaded, toggleEditMode, removeWidget, resetLayout }
}
