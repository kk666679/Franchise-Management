import type { LucideIcon } from "lucide-react"
import {
  Building2,
  CreditCard,
  FileText,
  LayoutDashboard,
  ScanBarcode,
  Settings,
  SparklesIcon,
  WalletCards,
} from "lucide-react"

import { PERMISSIONS, type PermissionCode } from "@/lib/rbac"

/**
 * Navigation contract.
 * Presentation-only filtering — every route enforces authorization server-side.
 */

export type NavigationStatus = "live" | "planned"

export type NavigationDestination = {
  href: string
  label: string
  icon: LucideIcon
  permission?: PermissionCode
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
    status: "live",
  },
  {
    href: "/dashboard/applications",
    label: "Applications",
    icon: FileText,
    permission: PERMISSIONS.FRANCHISE_READ,
    status: "live",
  },
  {
    href: "/dashboard/finance",
    label: "Finance",
    icon: WalletCards,
    permission: PERMISSIONS.FINANCE_READ,
    status: "live",
  },
  {
    href: "/dashboard/finance/invoices",
    label: "Invoices",
    icon: FileText,
    permission: PERMISSIONS.FINANCE_READ,
    status: "live",
  },
  {
    href: "/dashboard/finance/payments",
    label: "Payments",
    icon: CreditCard,
    permission: PERMISSIONS.FINANCE_READ,
    status: "live",
  },
  {
    href: "/dashboard/pos",
    label: "Point of sale",
    icon: ScanBarcode,
    permission: PERMISSIONS.SALES_READ,
    status: "live",
  },
  {
    href: "/dashboard/ai",
    label: "AI Assistant",
    icon: SparklesIcon,
    permission: PERMISSIONS.AI_ASSISTANT_USE,
    status: "live",
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
    permission: PERMISSIONS.SETTINGS_MANAGE,
    status: "live",
  },
]

export function visibleDestinations(
  granted: ReadonlySet<PermissionCode>
): readonly NavigationDestination[] {
  return navigationDestinations.filter(
    (d) => !d.permission || granted.has(d.permission)
  )
}
