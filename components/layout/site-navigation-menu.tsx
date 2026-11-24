"use client"

import Link from "next/link"
import {
  Bot,
  Building2,
  CreditCard,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  LockKeyhole,
  Menu,
  ScanBarcode,
  Settings2,
  WalletCards,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const menuSections = [
  {
    label: "Explore",
    links: [
      { href: "/", label: "Overview", icon: LayoutDashboard },
      { href: "/#architecture", label: "Architecture", icon: Building2 },
      { href: "/#features", label: "Platform features", icon: LifeBuoy },
      { href: "/#security", label: "Security", icon: LockKeyhole },
    ],
  },
  {
    label: "Workspace",
    links: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      {
        href: "/dashboard/franchises",
        label: "Franchisees",
        icon: Building2,
      },
      {
        href: "/dashboard/applications",
        label: "Applications",
        icon: FileText,
      },
      { href: "/dashboard/finance", label: "Finance", icon: WalletCards },
      {
        href: "/dashboard/finance/invoices",
        label: "Invoices",
        icon: FileText,
      },
      {
        href: "/dashboard/finance/payments",
        label: "Payments",
        icon: CreditCard,
      },
      { href: "/dashboard/pos", label: "Point of sale", icon: ScanBarcode },
      { href: "/dashboard/ai", label: "AI assistant", icon: Bot },
      { href: "/dashboard/settings", label: "Settings", icon: Settings2 },
    ],
  },
]

export function SiteNavigationMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Open site navigation menu"
          className="gap-2 rounded-full px-3 sm:px-4"
          size="sm"
          variant="outline"
        >
          <Menu aria-hidden="true" className="size-4" />
          <span className="hidden sm:inline">Explore</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="max-h-[min(80vh,36rem)] w-80 max-w-[calc(100vw-1rem)] overflow-y-auto rounded-2xl p-2"
        sideOffset={8}
      >
        {menuSections.map((section, index) => (
          <div key={section.label}>
            {index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel>{section.label}</DropdownMenuLabel>
            {section.links.map(({ href, label, icon: Icon }) => (
              <DropdownMenuItem asChild key={href}>
                <Link className="flex w-full items-center gap-3" href={href}>
                  <Icon
                    aria-hidden="true"
                    className="size-4 text-muted-foreground"
                  />
                  <span>{label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link className="flex w-full items-center gap-3" href="/login">
            <LockKeyhole
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
            <span>Log in</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link className="flex w-full items-center gap-3" href="/signup">
            <Building2
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
            <span>Sign up</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
