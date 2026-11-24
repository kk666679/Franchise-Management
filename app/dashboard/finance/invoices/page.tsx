import Link from "next/link"

import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { AppShell } from "@/components/layout/app-shell"
import { PageContainer } from "@/components/layout/page-container"
import { PageHeader } from "@/components/layout/page-header"
import { visibleDestinations } from "@/lib/navigation"
import { PageAccessNotice } from "@/components/auth/page-access-notice"
import { resolvePermissions } from "@lib/server/auth"
import {
  getFinanceInvoices,
  getFinanceOrganization,
  requireFinanceRead,
} from "@lib/server/finance"

export default async function FinanceInvoicesPage() {
  const context = await requireFinanceRead()
  if (!context.organizationId) {
    return (
      <PageAccessNotice
        title="Invoices"
        description="This invoice page is open to everyone. Sign in to view organization invoices."
      />
    )
  }

  const [organization, invoices] = await Promise.all([
    getFinanceOrganization(context.organizationId),
    getFinanceInvoices(context.organizationId),
  ])
  if (!organization) return null

  return (
    <AppShell
      brand={<span className="text-sm font-semibold">{organization.name}</span>}
      sidebar={
        <DashboardNav
          items={visibleDestinations(
            resolvePermissions([], context.membershipRole)
          )}
        />
      }
    >
      <PageContainer className="space-y-6">
        <PageHeader
          title="Invoices"
          description={`${invoices.length} recent invoices`}
        />
        <div className="overflow-x-auto rounded-2xl border border-border bg-card/60">
          <table className="w-full min-w-[52rem] text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-3">Invoice</th>
                <th className="px-4 py-3">Franchisee</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Issue date</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-right">Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-4 py-3 font-medium">
                    <Link
                      href={`/dashboard/finance/invoices/${invoice.id}`}
                      className="hover:text-primary"
                    >
                      {invoice.invoiceNo}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {invoice.franchisee.tradingName ??
                      invoice.franchisee.legalName}
                  </td>
                  <td className="px-4 py-3">{invoice.status}</td>
                  <td className="px-4 py-3">
                    {invoice.issueDate.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {invoice.total.toString()} {organization.currency}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {invoice.amountPaid.toString()} {organization.currency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageContainer>
    </AppShell>
  )
}
