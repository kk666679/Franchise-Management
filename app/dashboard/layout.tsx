import type { ReactNode } from "react"

export const dynamic = "force-dynamic"

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
    <div className="flex min-h-screen w-full overflow-x-hidden">
      <DashboardSidebar
        groups={dashboardNavigation}
        user={demoUser}
        organizationName="Northstar Group"
      />

      <main className="min-w-0 flex-1 flex flex-col">
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
        <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
        <footer className="shrink-0 border-t border-border/60">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-xs text-muted-foreground sm:px-6 lg:px-8">
            <span>Franchise Management</span>
            <span className="hidden sm:inline">Operations dashboard</span>
          </div>
        </footer>
      </main>
    </div>
  )
}
