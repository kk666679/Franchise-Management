import { Building2 } from "lucide-react"

type DashboardHeaderProps = {
  organizationName: string
  description?: string
}

export function DashboardHeader({ organizationName, description }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
          Overview
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {organizationName}
        </h1>
        {description ? (
          <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div
        className="hidden size-11 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-muted-foreground sm:flex"
        aria-hidden="true"
      >
        <Building2 className="size-5" />
      </div>
    </header>
  )
}
