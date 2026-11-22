"use client"

import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { FmsBrand } from "@/components/branding/fms-brand"
import { cn } from "@/lib/utils"

export type AppShellProps = {
  children: React.ReactNode
  /** Server-rendered navigation slot (e.g. <DashboardNav items={...} />). */
  sidebar?: React.ReactNode
  brand?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function AppShell({
  children,
  sidebar,
  brand,
  header,
  footer,
  className,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Close the mobile drawer on any route change (covers nav-slot links, which
  // are rendered server-side and cannot carry the drawer's click handler).
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  return (
    <div className={cn("min-h-svh bg-background text-foreground", className)}>
      <Button
        aria-label="Open navigation"
        aria-controls="primary-navigation"
        aria-expanded={sidebarOpen}
        className="fixed top-4 left-4 z-40 lg:hidden"
        onClick={() => setSidebarOpen(true)}
        size="icon"
        variant="outline"
      >
        <Menu />
      </Button>

      {sidebarOpen && (
        <button
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          type="button"
        />
      )}

      <aside
        id="primary-navigation"
        aria-label="Primary navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[min(86vw,18rem)] -translate-x-full flex-col p-4 glass transition-transform lg:translate-x-0",
          sidebarOpen && "translate-x-0"
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-4">
          <Link
            className="flex min-w-0 items-center gap-2 font-semibold"
            href="/dashboard"
            onClick={() => setSidebarOpen(false)}
          >
            <FmsBrand imageClassName="h-9 max-w-[9rem]" />
            {brand && <span className="min-w-0">{brand}</span>}
          </Link>
          <Button
            aria-label="Close navigation"
            aria-controls="primary-navigation"
            aria-expanded={sidebarOpen}
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
            size="icon-sm"
            variant="ghost"
          >
            <X />
          </Button>
        </div>
        <div className="mt-4 flex-1 overflow-y-auto">{sidebar}</div>
        {footer}
      </aside>

      <div className="min-w-0 lg:pl-[18rem]">
        {header}
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  )
}
