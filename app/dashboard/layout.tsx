import type { ReactNode } from "react"

import { AppShell } from "@/components/layout/app-shell"
import { DashboardMobileNav } from "@/components/dashboard/dashboard-mobile-nav"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar"
import { dashboardNavigation } from "@/lib/navigation"

const demoUser = {
  name: "Alex Morgan",
  email: "alex@northstar.co",
  image: null,
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      sidebar={
        <DashboardSidebar
          groups={dashboardNavigation}
          user={demoUser}
          organizationName="Northstar Group"
        />
      }
      topbar={
        <DashboardTopbar
          groups={dashboardNavigation}
          organizationName="Northstar Group"
          mobileNav={
            <DashboardMobileNav
              groups={dashboardNavigation}
              organizationName="Northstar Group"
            />
          }
        />
      }
    >
      {children}
    </AppShell>
  )
}
