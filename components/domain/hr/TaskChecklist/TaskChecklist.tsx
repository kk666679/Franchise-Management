"use client"

import { Checkbox } from "@/components/ui/checkbox"
import type { TaskChecklistProps } from "./TaskChecklist.types"

export function TaskChecklist({ items, onToggle }: TaskChecklistProps) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-2 text-sm">
          <Checkbox
            id={item.id}
            checked={item.done}
            onCheckedChange={(v) => onToggle(item.id, Boolean(v))}
          />
          <label
            htmlFor={item.id}
            className={item.done ? "text-muted-foreground line-through" : ""}
          >
            {item.label}
          </label>
        </li>
      ))}
      {items.length === 0 && (
        <li className="text-sm text-muted-foreground">No checklist items.</li>
      )}
    </ul>
  )
}
