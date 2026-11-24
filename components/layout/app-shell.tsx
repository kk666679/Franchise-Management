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
    <div className={cn("min-h-svh bg-background lg:flex", className)}>
      {sidebar}
      <div className="flex min-w-0 flex-1 flex-col">
        {topbar}
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
        {footer ?? (
          <footer className="border-t border-border/60">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-xs text-muted-foreground sm:px-6 lg:px-8">
              <span>Franchise Management</span>
              <span className="hidden sm:inline">Operations dashboard</span>
            </div>
          </footer>
        )}
      </div>
    </div>
  )
}
