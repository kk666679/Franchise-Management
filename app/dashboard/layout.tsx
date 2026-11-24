import type { ReactNode } from "react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { dashboardNavigation } from "@/lib/navigation"

const demoUser = {
  name: "Alex Morgan",
  email: "alex@northstar.co",
  image: null,
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell
      groups={dashboardNavigation}
      user={demoUser}
      organizationName="Northstar Group"
    >
      {children}
    </DashboardShell>
  )
}
