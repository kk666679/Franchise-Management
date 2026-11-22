import { notFound } from "next/navigation"

import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { AppShell } from "@/components/layout/app-shell"
import { PageContainer } from "@/components/layout/page-container"
import { PageHeader } from "@/components/layout/page-header"
import { visibleDestinations } from "@/lib/navigation"
import { PageAccessNotice } from "@/components/auth/page-access-notice"
import { resolvePermissions } from "@lib/server/auth"
import {
  getFinanceInvoice,
  getFinanceOrganization,
  requireFinanceRead,
} from "@lib/server/finance"

type InvoicePageProps = { params: Promise<{ id: string }> }

export default async function FinanceInvoicePage({ params }: InvoicePageProps) {
  const context = await requireFinanceRead()
  if (!context.organizationId) {
    return (
      <PageAccessNotice
        title="Invoice details"
        description="This invoice page is open to everyone. Sign in to view organization invoice details."
      />
    )
  }

  const { id } = await params
  const [organization, invoice] = await Promise.all([
    getFinanceOrganization(context.organizationId),
    getFinanceInvoice(context.organizationId, id),
  ])

  if (!organization || !invoice) notFound()

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
          title={invoice.invoiceNo}
          description={`Invoice for ${invoice.franchisee.tradingName ?? invoice.franchisee.legalName}`}
        />
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <section className="rounded-2xl border border-border bg-card/60 p-5">
            <h2 className="font-semibold">Line items</h2>
            <div className="mt-4 divide-y divide-border/70">
              {invoice.lines.map((line) => (
                <div
                  key={line.id}
                  className="flex items-center justify-between gap-4 py-3 text-sm"
                >
                  <span>
                    {line.description} × {line.quantity.toString()}
                  </span>
                  <span>
                    {line.amount.toString()} {organization.currency}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1 border-t border-border pt-4 text-right text-sm">
              <p>
                Subtotal: {invoice.subtotal.toString()} {organization.currency}
              </p>
              <p>
                Tax: {invoice.tax.toString()} {organization.currency}
              </p>
              <p className="font-semibold">
                Total: {invoice.total.toString()} {organization.currency}
              </p>
              <p>
                Paid: {invoice.amountPaid.toString()} {organization.currency}
              </p>
            </div>
          </section>
          <section className="rounded-2xl border border-border bg-card/60 p-5">
            <h2 className="font-semibold">Invoice details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Status</dt>
                <dd>{invoice.status}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Issue date</dt>
                <dd>{invoice.issueDate.toLocaleDateString()}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Due date</dt>
                <dd>{invoice.dueDate.toLocaleDateString()}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Contact</dt>
                <dd>{invoice.franchisee.email ?? "—"}</dd>
              </div>
            </dl>
          </section>
        </div>
      </PageContainer>
    </AppShell>
  )
}
