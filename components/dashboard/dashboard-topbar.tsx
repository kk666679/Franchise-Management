"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

import { findNavLabel, type NavigationGroup } from "@/lib/navigation"
import { cn } from "@/lib/utils"

type BreadcrumbItem = { label: string; href?: string }

type DashboardTopbarProps = {
  groups?: readonly NavigationGroup[]
  items?: readonly import("@/lib/navigation").NavigationDestination[]
  organizationName?: string
  breadcrumb?: BreadcrumbItem[]
  actions?: ReactNode
  mobileNav?: ReactNode
}

export function DashboardTopbar({
  groups,
  items,
  organizationName = "Franchise Management",
  breadcrumb,
  actions,
  mobileNav,
}: DashboardTopbarProps) {
  const navGroups = groups ?? (items ? [{ label: "Navigation", items }] : [])
  const pathname = usePathname()
  const currentLabel = findNavLabel(navGroups, pathname)
  const crumbs: BreadcrumbItem[] = breadcrumb ?? [
    { label: organizationName, href: "/dashboard" },
    ...(currentLabel ? [{ label: currentLabel }] : []),
  ]

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-6 lg:px-8">
        {mobileNav}
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
          {crumbs.map((item, i) => {
            const last = i === crumbs.length - 1
            return (
              <span key={`${item.label}-${i}`} className="flex min-w-0 items-center gap-1.5">
                {i > 0 ? <span aria-hidden="true" className="text-muted-foreground/50">/</span> : null}
                {item.href && !last ? (
                  <Link href={item.href} className="truncate text-muted-foreground transition-colors hover:text-foreground">
                    {item.label}
                  </Link>
                ) : (
                  <span className={cn("truncate", last ? "font-medium text-foreground" : "text-muted-foreground")} aria-current={last ? "page" : undefined}>
                    {item.label}
                  </span>
                )}
              </span>
            )
          })}
        </nav>
        {actions ? <div className="ml-auto flex items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  )
}
