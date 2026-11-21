"use client"

import type { LucideIcon } from "lucide-react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type AppNavigationItem = {
  href: string
  label: string
  icon: LucideIcon
}

export type AppShellProps = {
  children: React.ReactNode
  navigation: readonly AppNavigationItem[]
  brand?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function AppShell({
  children,
  navigation,
  brand = "Franchise Management",
  header,
  footer,
  className,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className={cn("min-h-svh bg-background text-foreground", className)}>
      <Button
        aria-label="Open navigation"
        className="fixed left-4 top-4 z-40 lg:hidden"
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
        aria-label="Primary navigation"
        className={cn(
          "glass fixed inset-y-0 left-0 z-50 flex w-[min(86vw,18rem)] -translate-x-full flex-col p-4 transition-transform lg:translate-x-0",
          sidebarOpen && "translate-x-0",
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-4">
          <Link className="truncate font-semibold" href="/dashboard" onClick={() => setSidebarOpen(false)}>
            {brand}
          </Link>
          <Button aria-label="Close navigation" className="lg:hidden" onClick={() => setSidebarOpen(false)} size="icon-sm" variant="ghost">
            <X />
          </Button>
        </div>
        <nav className="mt-4 flex-1 space-y-1 overflow-y-auto" aria-label="Application sections">
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link
              className="flex min-h-10 items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href={href}
              key={href}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon aria-hidden="true" className="size-4" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        {footer}
      </aside>

      <div className="min-w-0 lg:pl-[18rem]">
        {header}
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  )
}
