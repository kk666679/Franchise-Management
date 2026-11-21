import type { LucideIcon } from "lucide-react"
import {
  BarChart3,
  Building2,
  FileText,
  LayoutDashboard,
  Settings,
  WalletCards,
} from "lucide-react"

import { PERMISSIONS, type PermissionCode } from "@/lib/rbac"

/**
 * Navigation contract.
 *
 * Single source of truth for application destinations so that navigation can be
 * (a) rendered consistently and (b) filtered by permission on the server. This
 * module is pure data + types and is safe to import from both server and client.
 *
 * IMPORTANT: hiding an item here is a *presentation* concern only. Every route
 * MUST still enforce authorization at its own server boundary.
 */

export type NavigationStatus = "live" | "planned"

export type NavigationDestination = {
  href: string
  label: string
  icon: LucideIcon
  /** Permission required to show this destination (presentation only). */
  permission?: PermissionCode
  /** "live" renders a link; "planned" renders a clearly-disabled placeholder. */
  status: NavigationStatus
}

export const navigationDestinations: readonly NavigationDestination[] = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
    status: "live",
  },
  {
    href: "/dashboard/franchises",
    label: "Franchises",
    icon: Building2,
    permission: PERMISSIONS.FRANCHISE_READ,
    status: "planned",
  },
  {
    href: "/dashboard/applications",
    label: "Applications",
    icon: FileText,
    permission: PERMISSIONS.FRANCHISE_APPLICATION_REVIEW,
    status: "planned",
  },
  {
    href: "/dashboard/finance",
    label: "Finance",
    icon: WalletCards,
    permission: PERMISSIONS.FINANCE_READ,
    status: "planned",
  },
  {
    href: "/dashboard/reports",
    label: "Reports",
    icon: BarChart3,
    permission: PERMISSIONS.FINANCE_READ,
    status: "planned",
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
    permission: PERMISSIONS.SETTINGS_MANAGE,
    status: "planned",
  },
]

/** Destinations a given permission set is allowed to see (presentation only). */
export function visibleDestinations(
  granted: ReadonlySet<PermissionCode>,
): readonly NavigationDestination[] {
  return navigationDestinations.filter(
    (destination) => !destination.permission || granted.has(destination.permission),
  )
}