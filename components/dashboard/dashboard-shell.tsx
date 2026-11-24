"use client"

import type { ReactNode } from "react"

import { AppShell } from "@/components/layout/app-shell"
import type { NavigationDestination, NavigationGroup } from "@/lib/navigation"

import { DashboardMobileNav } from "./dashboard-mobile-nav"
import { DashboardSidebar, type DashboardUser } from "./dashboard-sidebar"
import { DashboardTopbar } from "./dashboard-topbar"

export type DashboardShellProps = {
  groups?: readonly NavigationGroup[]
  navigation?: readonly NavigationDestination[]
  user?: DashboardUser | null
  onLogout?: () => void
  organizationName?: string
  breadcrumb?: { label: string; href?: string }[]
  actions?: ReactNode
  children: ReactNode
}

export function DashboardShell({
  groups,
  navigation,
  user,
  onLogout,
  organizationName = "Franchise Management",
  breadcrumb,
  actions,
  children,
}: DashboardShellProps) {
  const navGroups = groups ?? (navigation ? [{ label: "Navigation", items: navigation }] : [])
  return (
    <AppShell
      sidebar={
        <DashboardSidebar
          groups={navGroups}
          user={user}
          onLogout={onLogout}
          organizationName={organizationName}
        />
      }
      topbar={
        <DashboardTopbar
          groups={navGroups}
          organizationName={organizationName}
          breadcrumb={breadcrumb}
          actions={actions}
          mobileNav={<DashboardMobileNav groups={navGroups} organizationName={organizationName} />}
        />
      }
    >
      {children}
    </AppShell>
  )
}
