import { Building2, MapPin, Plus } from "lucide-react"
import Link from "next/link"

import { AppShell } from "@/components/layout/app-shell"
import { PageContainer } from "@/components/layout/page-container"
import { PageHeader } from "@/components/layout/page-header"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { StatusIndicator } from "@/components/shared/status-indicator"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/feedback/empty-state"
import { getCurrentSession } from "@lib/server/auth/session"
import { resolvePermissions } from "@lib/server/auth"
import { visibleDestinations } from "@/lib/navigation"
import { prisma } from "@/lib/prisma"

async function getFranchisees(orgId: string) {
  return prisma.franchisee.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      legalName: true,
      tradingName: true,
      status: true,
      email: true,
      createdAt: true,
      brand: { select: { name: true } },
      locations: { select: { id: true }, where: { status: "ACTIVE" } },
      _count: { select: { agreements: true, invoices: true } },
    },
  })
}

const STATUS_TONE = {
  PROSPECT: "info",
  ACTIVE: "success",
  ON_HOLD: "warning",
  EXITED: "danger",
} as const

const STATUS_LABEL = {
  PROSPECT: "Prospect",
  ACTIVE: "Active",
  ON_HOLD: "On hold",
  EXITED: "Exited",
} as const

export default async function FranchisesPage() {
  const session = await getCurrentSession()
  
  const franchisees = await getFranchisees(session?.org ?? "")
  const granted = resolvePermissions([], session?.role ?? undefined)
  const navigation = visibleDestinations(granted)

  const active = franchisees.filter((f) => f.status === "ACTIVE").length
  const prospects = franchisees.filter((f) => f.status === "PROSPECT").length
  const onHold = franchisees.filter((f) => f.status === "ON_HOLD").length

  return (
    <AppShell
      brand={
        <span className="flex items-center gap-2 text-sm font-semibold">
          <Building2 className="size-4 text-primary" />
          Franchise Management
        </span>
      }
      sidebar={<DashboardNav items={navigation} />}
    >
      <PageContainer className="space-y-6">
        <PageHeader
          title="Franchisees"
          description={`${franchisees.length} total · ${active} active · ${prospects} prospects`}
          actions={
            <Button className="rounded-full" size="sm">
              <Plus className="size-4" />
              Add franchisee
            </Button>
          }
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(
            [
              ["Total", franchisees.length],
              ["Active", active],
              ["Prospects", prospects],
              ["On hold", onHold],
            ] as const
          ).map(([label, count]) => (
            <div key={label} className="glass rounded-2xl p-4">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{count}</p>
            </div>
          ))}
        </div>

        {franchisees.length === 0 ? (
          <EmptyState
            title="No franchisees yet"
            description="Add your first franchisee to get started."
            icon={<Building2 className="size-5" />}
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-card/60">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[48rem] text-left text-sm">
                <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Franchisee</th>
                    <th className="px-4 py-3 font-medium">Brand</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Locations</th>
                    <th className="px-4 py-3 text-right font-medium">Agreements</th>
                    <th className="px-4 py-3 font-medium">Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {franchisees.map((f) => (
                    <tr key={f.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <Link
                          href={`/dashboard/franchises/${f.id}`}
                          className="font-medium hover:text-primary"
                        >
                          {f.tradingName ?? f.legalName}
                        </Link>
                        {f.tradingName && (
                          <p className="text-xs text-muted-foreground">{f.legalName}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {f.brand?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusIndicator
                          label={STATUS_LABEL[f.status]}
                          tone={STATUS_TONE[f.status]}
                        />
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3 text-muted-foreground" />
                          {f.locations.length}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {f._count.agreements}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {f.email ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
              {franchisees.length} franchisee{franchisees.length !== 1 ? "s" : ""}
            </div>
          </div>
        )}
      </PageContainer>
    </AppShell>
  )
}

