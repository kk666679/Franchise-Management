import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function ChartContainer({ title, description, children, className }: { title?: string; description?: string; children: ReactNode; className?: string }) {
  return <section className={cn("rounded-2xl border border-border bg-card/70 p-4 shadow-sm sm:p-6", className)}>
    {title ? <div className="mb-5"><h3 className="font-semibold">{title}</h3>{description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}</div> : null}
    {children}
  </section>
}
