import type { ReactNode } from "react"

import { Inbox } from "lucide-react"

import { Button } from "@/components/ui/button"

export function EmptyState({ title, description, action, icon = <Inbox aria-hidden="true" className="size-5" /> }: { title: string; description?: string; action?: { label: string; onClick: () => void }; icon?: ReactNode }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-border p-6 text-center">
      <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">{icon}</div>
      <h3 className="font-medium">{title}</h3>
      {description ? <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p> : null}
      {action ? <Button className="mt-4" onClick={action.onClick} size="sm">{action.label}</Button> : null}
    </div>
  )
}
