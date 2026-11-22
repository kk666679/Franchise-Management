import { Building2, CircleDollarSign, Store, Users } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { MetricCard } from "@/components/dashboard/metric-card"
import { RecentApplications } from "@/components/dashboard/recent-applications"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { AppShell } from "@/components/layout/app-shell"
import { PageContainer } from "@/components/layout/page-container"
import { visibleDestinations } from "@/lib/navigation"
import { getDashboardData } from "@lib/server/dashboard"
import { resolvePermissions } from "@lib/server/auth"
import { getCurrentSession } from "@lib/server/auth/session"
import { PageAccessNotice } from "@/components/auth/page-access-notice"

const money = (value: number, currency: string) =>
  new Intl.NumberFormat("en", { style: "currency", currency, maximumFractionDigits: 0 }).format(value)

export default async function DashboardPage() {
  const session = await getCurrentSession()
  if (!session?.org) {
    return (
      <PageAccessNotice
        title="Dashboard"
        description="The dashboard is available without signing in. Sign in to view organization data and metrics."
      />
    )
  }

  const orgId = session.org
  const data = await getDashboardData(orgId)
  if (!data) return null

  // Presentation-only filtering: hide destinations the session's role cannot
  // see. Route access remains enforced at each server boundary.
  const granted = resolvePermissions([], session?.role ?? undefined)
  const navigation = visibleDestinations(granted)

  return (
    <AppShell
      brand={
        <>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Building2 className="size-4" />
          </span>
          <span className="truncate text-sm font-semibold">{data.organization.name}</span>
        </>
      }
      sidebar={<DashboardNav items={navigation} />}
    >
      <PageContainer className="space-y-6">
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
      </PageContainer>
    </AppShell>
  )
}

