import { notFound } from "next/navigation"
import { Building2, Mail, MapPin, Phone } from "lucide-react"
import Link from "next/link"

import { AppShell } from "@/components/layout/app-shell"
import { PageContainer } from "@/components/layout/page-container"
import { PageHeader } from "@/components/layout/page-header"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { StatusIndicator } from "@/components/shared/status-indicator"
import { CurrencyDisplay } from "@/components/shared/currency-display"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCurrentSession } from "@lib/server/auth/session"
import { resolvePermissions, assertPermission } from "@lib/server/auth"
import { visibleDestinations } from "@/lib/navigation"
import { PERMISSIONS } from "@/lib/rbac"
import { getFranchisee } from "@lib/server/services/franchise"
import { prisma } from "@/lib/prisma"
import { NotFoundError } from "@lib/server/errors"
import { PageAccessNotice } from "@/components/auth/page-access-notice"

const dateFmt = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" })

const STATUS_TONE = {
  PROSPECT: "info",
  ACTIVE: "success",
  ON_HOLD: "warning",
  EXITED: "danger",
} as const

export default async function FranchiseeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getCurrentSession()
  if (!session?.org) {
    return (
      <PageAccessNotice
        title="Franchise details"
        description="This franchise page is open to everyone. Sign in to view organization franchise details."
      />
    )
  }
  const ctx = {
    userId: session.sub,
    organizationId: session.org,
    membershipRole: session.role ?? undefined,
  }
  assertPermission(ctx, PERMISSIONS.FRANCHISE_READ)

  let franchisee
  try {
    franchisee = await getFranchisee(ctx, id)
  } catch (e) {
    if (e instanceof NotFoundError) notFound()
    throw e
  }

  const [granted, org] = await Promise.all([
    resolvePermissions([], session?.role ?? undefined),
    prisma.organization.findUnique({ where: { id: session.org }, select: { currency: true } }),
  ])
  const navigation = visibleDestinations(granted)
  const currency = org?.currency ?? "USD"

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
          title={franchisee.tradingName ?? franchisee.legalName}
          description={franchisee.tradingName ? franchisee.legalName : undefined}
          actions={
            <StatusIndicator
              label={franchisee.status.replace("_", " ")}
              tone={STATUS_TONE[franchisee.status]}
            />
          }
        />

        {/* Summary strip */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(
            [
              ["Brand", franchisee.brand?.name ?? "—"],
              ["Locations", String(franchisee.locations.length)],
              ["Agreements", String(franchisee.agreements.length)],
              ["Invoices", String(franchisee.invoices.length)],
            ] as [string, string][]
          ).map(([label, value]) => (
            <div key={label} className="glass rounded-2xl p-4">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="mt-1 text-xl font-semibold">{value}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="glass rounded-xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="agreements">Agreements</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="glass rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold">Contact details</h2>
              <dl className="space-y-3 text-sm">
                {franchisee.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-muted-foreground shrink-0" />
                    <a href={`mailto:${franchisee.email}`} className="hover:text-primary">{franchisee.email}</a>
                  </div>
                )}
                {franchisee.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-muted-foreground shrink-0" />
                    <span>{franchisee.phone}</span>
                  </div>
                )}
                {franchisee.registrationNo && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Registration No.</dt>
                    <dd className="mt-0.5 font-mono">{franchisee.registrationNo}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="glass rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold">Key contacts</h2>
              {franchisee.contacts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No contacts recorded.</p>
              ) : (
                <ul className="space-y-3">
                  {franchisee.contacts.map((c) => (
                    <li key={c.id} className="flex items-start justify-between gap-2 text-sm">
                      <div>
                        <p className="font-medium">{c.name}</p>
                        {c.title && <p className="text-xs text-muted-foreground">{c.title}</p>}
                        {c.email && <p className="text-xs text-muted-foreground">{c.email}</p>}
                      </div>
                      {c.isPrimary && <Badge variant="secondary" className="text-xs">Primary</Badge>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </TabsContent>

          {/* Locations */}
          <TabsContent value="locations" className="mt-6">
            {franchisee.locations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No locations.</p>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-border bg-card/60">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Code</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">City</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/70">
                    {franchisee.locations.map((loc) => (
                      <tr key={loc.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 font-medium">{loc.name}</td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{loc.code}</td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className="text-xs">{loc.status}</Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{loc.city}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          {/* Agreements */}
          <TabsContent value="agreements" className="mt-6">
            {franchisee.agreements.length === 0 ? (
              <p className="text-sm text-muted-foreground">No agreements.</p>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-border bg-card/60">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">Agreement</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Start</th>
                      <th className="px-4 py-3 font-medium">End</th>
                      <th className="px-4 py-3 text-right font-medium">Royalty %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/70">
                    {franchisee.agreements.map((agr) => (
                      <tr key={agr.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 font-mono text-xs">{agr.agreementNo}</td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className="text-xs">{agr.status}</Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{dateFmt.format(agr.startDate)}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {agr.endDate ? dateFmt.format(agr.endDate) : "—"}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">{Number(agr.royaltyRate).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          {/* Invoices */}
          <TabsContent value="invoices" className="mt-6">
            {franchisee.invoices.length === 0 ? (
              <p className="text-sm text-muted-foreground">No invoices.</p>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-border bg-card/60">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">Invoice</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 text-right font-medium">Total</th>
                      <th className="px-4 py-3 text-right font-medium">Paid</th>
                      <th className="px-4 py-3 font-medium">Due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/70">
                    {franchisee.invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 font-mono text-xs">{inv.invoiceNo}</td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className="text-xs">{inv.status}</Badge>
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          <CurrencyDisplay value={Number(inv.total)} currency={currency} />
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          <CurrencyDisplay value={Number(inv.amountPaid)} currency={currency} />
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{dateFmt.format(inv.dueDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </PageContainer>
    </AppShell>
  )
}
