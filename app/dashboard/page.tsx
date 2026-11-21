import { redirect } from "next/navigation"
import { Building2, CircleDollarSign, Store, Users } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { MetricCard } from "@/components/dashboard/metric-card"
import { RecentApplications } from "@/components/dashboard/recent-applications"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { visibleDestinations } from "@/lib/navigation"
import { getDashboardData } from "@/lib/server/dashboard"
import { resolvePermissions } from "@/lib/server/auth"
import { getCurrentSession } from "@/lib/server/auth/session"

const money = (value: number, currency: string) =>
  new Intl.NumberFormat("en", { style: "currency", currency, maximumFractionDigits: 0 }).format(value)

export default async function DashboardPage() {
  const session = await getCurrentSession()
  if (!session?.org) redirect("/login")

  const data = await getDashboardData(session.org)
  if (!data) redirect("/login")

  // Presentation-only filtering: hide destinations the session's role cannot
  // see. Route access remains enforced at each server boundary.
  const granted = resolvePermissions([], session.role ?? undefined)
  const navigation = visibleDestinations(granted)

  return (
    <main className="min-h-svh p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid w-full max-w-[1600px] gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="glass h-fit rounded-2xl p-3 lg:sticky lg:top-6">
          <div className="mb-4 flex items-center gap-2 px-3 py-2">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary/15 text-primary"><Building2 className="size-4" /></div>
            <span className="truncate text-sm font-semibold">{data.organization.name}</span>
          </div>
          <DashboardNav items={navigation} />
        </aside>
        <div className="min-w-0 space-y-6">
          <DashboardHeader organizationName={data.organization.name} />
          <section className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-5" aria-label="Key performance indicators">
            <MetricCard label="Active brands" value={String(data.metrics.brands)} detail="Currently operating" icon={Building2} />
            <MetricCard label="Active outlets" value={String(data.metrics.activeLocations)} detail="Across all brands" icon={Store} />
            <MetricCard label="Franchisees" value={String(data.metrics.franchisees)} detail="Active partners" icon={Users} />
            <MetricCard label="Collected this month" value={money(data.metrics.collectedThisMonth, data.organization.currency)} detail="Successful payments" icon={CircleDollarSign} />
            <MetricCard label="Outstanding" value={money(data.metrics.outstandingBalance, data.organization.currency)} detail="Open invoice balance" icon={CircleDollarSign} />
          </section>
          <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,1fr)]">
            <RevenueChart values={data.revenue} currency={data.organization.currency} />
            <RecentApplications applications={data.applications} />
          </div>
        </div>
      </div>
    </main>
  )
}
