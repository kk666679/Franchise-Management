"use client"

import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export type AppShellProps = {
  children: ReactNode
  sidebar?: ReactNode
  topbar?: ReactNode
  footer?: ReactNode
  className?: string
}

export function AppShell({ sidebar, topbar, footer, children, className }: AppShellProps) {
  return (
    <div className={cn("flex min-h-screen w-full overflow-x-hidden bg-background", className)}>
      {sidebar}
      <main className="min-w-0 flex-1 flex flex-col">
        {topbar}
        <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
        {footer ?? (
          <footer className="shrink-0 border-t border-border/60">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-xs text-muted-foreground sm:px-6 lg:px-8">
              <span>Franchise Management</span>
              <span className="hidden sm:inline">Operations dashboard</span>
            </div>
          </footer>
        )}
      </main>
    </div>
  )
}
