"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { NavigationGroup } from "@/lib/navigation"
import { cn } from "@/lib/utils"

import { DashboardNav } from "./dashboard-nav"

type DashboardMobileNavProps = {
  groups?: readonly NavigationGroup[]
  items?: readonly import("@/lib/navigation").NavigationDestination[]
  organizationName?: string
}

export function DashboardMobileNav({ groups, items, organizationName = "Franchise Management" }: DashboardMobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  const navGroups = groups ?? (items ? [{ label: "Navigation", items }] : [])

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="size-9 shrink-0 lg:hidden"
        aria-label="Open navigation menu"
        aria-expanded={open}
        aria-controls="mobile-dashboard-nav"
        onClick={() => setOpen(true)}
      >
        <Menu className="size-5" aria-hidden="true" />
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <button
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside
            id="mobile-dashboard-nav"
            className={cn("absolute inset-y-0 left-0 flex w-[min(20rem,85vw)] flex-col border-r border-border/60 bg-background shadow-xl")}
          >
            <div className="flex h-14 items-center justify-between border-b border-border/60 px-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-tight">{organizationName}</p>
                <p className="text-[11px] text-muted-foreground">Operations</p>
              </div>
              <Button variant="ghost" size="icon" className="size-8" aria-label="Close menu" onClick={() => setOpen(false)}>
                <X className="size-4" aria-hidden="true" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4">
              <DashboardNav groups={navGroups} />
            </div>
          </aside>
        </div>
      ) : null}
    </>
  )
}
