"use client"

import { AppShell } from "@/components/layout/app-shell"

import { DashboardMobileNav } from "./dashboard-mobile-nav"
import { DashboardSidebar } from "./dashboard-sidebar"
import { DashboardTopbar } from "./dashboard-topbar"
import { normalizeNavGroups } from "./nav-utils"
import type { DashboardShellProps } from "./types"

export type { DashboardShellProps } from "./types"

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
  const navGroups = normalizeNavGroups(groups, navigation)

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
