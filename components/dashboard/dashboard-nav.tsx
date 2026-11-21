import Link from "next/link"

import type { NavigationDestination } from "@/lib/navigation"
import { cn } from "@/lib/utils"

const itemClass =
  "inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors lg:flex"

export type DashboardNavProps = {
  items: readonly NavigationDestination[]
}

export function DashboardNav({ items }: DashboardNavProps) {
  return (
    <nav
      aria-label="Dashboard navigation"
      className="flex gap-1 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:pb-0"
    >
      {items.map(({ href, label, icon: Icon, status }) => {
        if (status === "live") {
          return (
            <Link
              key={href}
              href={href}
              className={cn(itemClass, "text-muted-foreground hover:bg-muted hover:text-foreground")}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </Link>
          )
        }

        return (
          <span
            key={href}
            aria-disabled="true"
            className={cn(itemClass, "cursor-not-allowed text-muted-foreground/50")}
            title={`${label} is not available yet`}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
            <span className="rounded-full border border-border px-1.5 py-0.5 font-medium uppercase tracking-wide text-muted-foreground/70">
              Soon
            </span>
          </span>
        )
      })}
    </nav>
  )
}
