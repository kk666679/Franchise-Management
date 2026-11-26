import type { ReactNode } from "react"

import type { NavigationDestination, NavigationGroup } from "@/lib/navigation"

export type DashboardUser = {
  name?: string | null
  email?: string | null
  image?: string | null
}

export type DashboardNavProps = {
  groups?: readonly NavigationGroup[]
  items?: readonly NavigationDestination[]
  collapsed?: boolean
}

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
