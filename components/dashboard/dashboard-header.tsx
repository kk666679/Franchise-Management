import { Bell, Plus } from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

export function DashboardHeader({
  organizationName,
}: {
  organizationName: string
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-5">
      <div className="min-w-0">
        <p className="truncate text-sm text-muted-foreground">
          {organizationName}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Executive overview
        </h1>
      </div>
      <div className="flex items-center gap-2" aria-label="Dashboard actions">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-full"
          aria-label="Notifications"
        >
          <Bell className="size-4" aria-hidden="true" />
        </Button>
        <ThemeToggle />
        <Button type="button" className="hidden rounded-full sm:inline-flex">
          <Plus className="size-4" aria-hidden="true" />
          New application
        </Button>
      </div>
    </header>
  )
}
