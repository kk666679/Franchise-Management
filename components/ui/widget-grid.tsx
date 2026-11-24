"use client"

import { cn } from "@/lib/utils"
import type { WidgetKind } from "@/lib/widget-metadata"
import { WIDGET_DEFINITIONS } from "@/lib/widget-metadata"
import { GripVertical, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export type WidgetItem = {
  id: string
  kind: WidgetKind
}

type WidgetGridProps = {
  widgets: WidgetItem[]
  editMode?: boolean
  onRemove?: (id: string) => void
  renderWidget: (item: WidgetItem) => React.ReactNode
}

const SIZE_SPAN: Record<string, string> = {
  sm: "col-span-12 sm:col-span-6 xl:col-span-3",
  md: "col-span-12 sm:col-span-6 xl:col-span-4",
  lg: "col-span-12 xl:col-span-8",
}

export function WidgetGrid({
  widgets,
  editMode = false,
  onRemove,
  renderWidget,
}: WidgetGridProps) {
  return (
    <div className="grid grid-cols-12 gap-4">
      {widgets.map((item) => {
        const def = WIDGET_DEFINITIONS[item.kind]
        return (
          <div
            key={item.id}
            className={cn(
              "relative min-w-0",
              SIZE_SPAN[def.defaultSize] ?? SIZE_SPAN.md,
              editMode &&
                "rounded-2xl ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
            )}
          >
            {editMode && (
              <div className="absolute -top-2 -right-2 z-10 flex items-center gap-1">
                <span className="flex size-6 cursor-grab items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <GripVertical className="size-3" />
                </span>
                {onRemove && (
                  <Button
                    size="icon-xs"
                    variant="destructive"
                    className="size-6 rounded-full"
                    onClick={() => onRemove(item.id)}
                    aria-label={`Remove ${def.label}`}
                  >
                    <X className="size-3" />
                  </Button>
                )}
              </div>
            )}
            {renderWidget(item)}
          </div>
        )
      })}
    </div>
  )
}
