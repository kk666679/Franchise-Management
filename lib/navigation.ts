import type { LucideIcon } from "lucide-react"
import {
  Bell,
  Building2,
  ClipboardCheck,
  CreditCard,
  FileBarChart2,
  FileText,
  FolderOpen,
  GitBranch,
  LayoutDashboard,
  LifeBuoy,
  MapPin,
  ScanBarcode,
  ScrollText,
  Settings,
  SparklesIcon,
  WalletCards,
  Workflow,
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
  iconName?: string
  icon?: LucideIcon
  permission?: PermissionCode
  status: NavigationStatus
  badge?: string
}

export const navigationDestinations: readonly NavigationDestination[] = [
  {
    href: "/dashboard",
    label: "Overview",
    iconName: "LayoutDashboard",
    status: "live",
  },
  {
    href: "/dashboard/franchises",
    label: "Franchises",
    iconName: "Building2",
    permission: PERMISSIONS.FRANCHISE_READ,
    status: "live",
  },
  {
    href: "/dashboard/applications",
    label: "Applications",
    iconName: "FileText",
    permission: PERMISSIONS.FRANCHISE_READ,
    status: "live",
  },
  {
    href: "/dashboard/agreements",
    label: "Agreements",
    iconName: "ScrollText",
    permission: PERMISSIONS.FRANCHISE_READ,
    status: "live",
  },
  {
    href: "/dashboard/brands",
    label: "Brands",
    iconName: "GitBranch",
    permission: PERMISSIONS.BRAND_READ,
    status: "live",
  },
  {
    href: "/dashboard/locations",
    label: "Locations",
    iconName: "MapPin",
    permission: PERMISSIONS.BRANCH_READ,
    status: "live",
  },
  {
    href: "/dashboard/finance",
    label: "Finance",
    iconName: "WalletCards",
    permission: PERMISSIONS.FINANCE_READ,
    status: "live",
  },
  {
    href: "/dashboard/finance/invoices",
    label: "Invoices",
    iconName: "FileText",
    permission: PERMISSIONS.FINANCE_READ,
    status: "live",
  },
  {
    href: "/dashboard/finance/payments",
    label: "Payments",
    iconName: "CreditCard",
    permission: PERMISSIONS.FINANCE_READ,
    status: "live",
  },
  {
    href: "/dashboard/pos",
    label: "Point of sale",
    iconName: "ScanBarcode",
    permission: PERMISSIONS.SALES_READ,
    status: "live",
  },
  {
    href: "/dashboard/documents",
    label: "Documents",
    iconName: "FolderOpen",
    permission: PERMISSIONS.DOCUMENT_READ,
    status: "live",
  },
  {
    href: "/dashboard/support",
    label: "Support",
    iconName: "LifeBuoy",
    permission: PERMISSIONS.OPERATIONS_READ,
    status: "live",
  },
  {
    href: "/dashboard/audit",
    label: "Audit log",
    iconName: "ClipboardCheck",
    permission: PERMISSIONS.AUDIT_READ,
    status: "live",
  },
  {
    href: "/dashboard/workflows",
    label: "Workflows",
    iconName: "Workflow",
    permission: PERMISSIONS.OPERATIONS_READ,
    status: "live",
  },
  {
    href: "/dashboard/reporting",
    label: "Reporting",
    iconName: "FileBarChart2",
    permission: PERMISSIONS.FINANCE_READ,
    status: "live",
  },
  {
    href: "/dashboard/notifications",
    label: "Notifications",
    iconName: "Bell",
    status: "live",
  },
  {
    href: "/dashboard/ai",
    label: "AI Assistant",
    iconName: "SparklesIcon",
    permission: PERMISSIONS.AI_ASSISTANT_USE,
    status: "live",
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    iconName: "Settings",
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

export type NavigationGroup = {
  label: string
  items: readonly NavigationDestination[]
}

export function findNavLabel(
  groups: readonly NavigationGroup[],
  pathname: string | null
): string | null {
  if (!pathname) return null
  let best: { label: string; length: number } | null = null
  for (const group of groups) {
    for (const item of group.items) {
      if (item.status !== "live") continue
      const matches = pathname === item.href || pathname.startsWith(`${item.href}/`)
      if (matches && (!best || item.href.length > best.length)) {
        best = { label: item.label, length: item.href.length }
      }
    }
  }
  return best?.label ?? null
}

export const dashboardNavigation: readonly NavigationGroup[] = [
  {
    label: "Workspace",
    items: navigationDestinations.filter((d) => ["/dashboard", "/dashboard/franchises", "/dashboard/applications", "/dashboard/agreements", "/dashboard/brands", "/dashboard/locations"].includes(d.href)),
  },
  {
    label: "Operations",
    items: navigationDestinations.filter((d) => ["/dashboard/finance", "/dashboard/finance/invoices", "/dashboard/finance/payments", "/dashboard/pos", "/dashboard/documents", "/dashboard/support"].includes(d.href)),
  },
  {
    label: "Management",
    items: navigationDestinations.filter((d) => ["/dashboard/audit", "/dashboard/workflows", "/dashboard/reporting", "/dashboard/notifications", "/dashboard/ai", "/dashboard/settings"].includes(d.href)),
  },
]
