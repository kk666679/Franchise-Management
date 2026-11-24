"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bell, Building2, ClipboardCheck, CreditCard, FileBarChart2, FileText, FolderOpen, GitBranch,
  LayoutDashboard, LifeBuoy, MapPin, ScanBarcode, ScrollText, Settings, SparklesIcon, WalletCards, Workflow,
  type LucideIcon,
} from "lucide-react"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { NavigationDestination, NavigationGroup } from "@/lib/navigation"

const ICONS: Record<string, LucideIcon> = {
  Bell, Building2, ClipboardCheck, CreditCard, FileBarChart2, FileText, FolderOpen, GitBranch,
  LayoutDashboard, LifeBuoy, MapPin, ScanBarcode, ScrollText, Settings, SparklesIcon, WalletCards, Workflow,
}

type DashboardNavProps = {
  groups?: readonly NavigationGroup[]
  items?: readonly NavigationDestination[]
  collapsed?: boolean
}

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false
  if (href === "/dashboard") return pathname === "/dashboard"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function DashboardNav({ groups, items, collapsed = false }: DashboardNavProps) {
  const navGroups = groups ?? (items ? [{ label: "Navigation", items }] : [])
  const pathname = usePathname()

  const content = (
    <nav aria-label="Dashboard navigation" className={cn("space-y-6", collapsed && "space-y-4")}>
      {navGroups.map((group, groupIndex) => (
        <div key={group.label} className="space-y-1">
          {!collapsed ? (
            <p className="px-3 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground/70">
              {group.label}
            </p>
          ) : groupIndex > 0 ? (
            <div className="mx-auto my-2 h-px w-8 bg-border/60" aria-hidden="true" />
          ) : null}
          <div className="space-y-0.5">
            {group.items.map((item: any) => {
              const { href, label, status, badge, iconName } = item
              const Icon = item.icon ?? (iconName ? ICONS[iconName] : undefined) ?? LayoutDashboard
              const active = status === "live" && isActive(pathname, href)

              if (status === "live") {
                const link = (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    aria-label={collapsed ? label : undefined}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2",
                      active
                        ? "bg-primary/10 text-foreground font-medium"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    <Icon className={cn("size-4 shrink-0", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} aria-hidden="true" />
                    {!collapsed ? <span className="truncate">{label}</span> : null}
                    {!collapsed && badge ? (
                      <span className="ml-auto rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                        {badge}
                      </span>
                    ) : null}
                  </Link>
                )
                if (!collapsed) return link
                return (
                  <Tooltip key={href}>
                    <TooltipTrigger asChild>{link}</TooltipTrigger>
                    <TooltipContent side="right" sideOffset={8}>
                      {label}
                    </TooltipContent>
                  </Tooltip>
                )
              }

              const disabled = (
                <span
                  key={href}
                  aria-disabled="true"
                  aria-label={collapsed ? `${label} (soon)` : undefined}
                  title={!collapsed ? `${label} is not available yet` : undefined}
                  className={cn(
                    "flex cursor-not-allowed items-center gap-3 rounded-lg text-sm text-muted-foreground/45",
                    collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2"
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  {!collapsed ? <span className="truncate">{label}</span> : null}
                  {!collapsed ? (
                    <span className="ml-auto rounded-md border border-border/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground/60">
                      Soon
                    </span>
                  ) : null}
                </span>
              )
              if (!collapsed) return disabled
              return (
                <Tooltip key={href}>
                  <TooltipTrigger asChild>{disabled}</TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    {label} (Soon)
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )

  if (collapsed) return <TooltipProvider delayDuration={0}>{content}</TooltipProvider>
  return content
}
