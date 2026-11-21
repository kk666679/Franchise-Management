import Link from "next/link"
import { BarChart3, Building2, FileText, LayoutDashboard, Settings, WalletCards } from "lucide-react"

const navigation = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Franchises", href: "/dashboard/franchises", icon: Building2 },
  { label: "Applications", href: "/dashboard/applications", icon: FileText },
  { label: "Finance", href: "/dashboard/finance", icon: WalletCards },
  { label: "Reports", href: "/dashboard/reports", icon: BarChart3 },
]

export function DashboardNav() {
  return (
    <nav aria-label="Dashboard navigation" className="flex gap-1 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:pb-0">
      {navigation.map(({ label, href, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:flex"
        >
          <Icon className="size-4" />
          {label}
        </Link>
      ))}
      <Link
        href="/dashboard/settings"
        className="inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:mt-8 lg:flex"
      >
        <Settings className="size-4" />
        Settings
      </Link>
    </nav>
  )
}
