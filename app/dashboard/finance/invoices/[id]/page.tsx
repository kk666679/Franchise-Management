import { notFound } from "next/navigation"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/feedback/empty-state"
import { InvoiceDetail } from "@/components/domain/finance/InvoiceDetail"
import {
  toInvoiceStatus,
  type InvoiceView,
} from "@/components/domain/finance/mappers"
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
      <EmptyState
        title="Sign in required"
        description="Sign in to view organization invoice details."
      />
    )
  }

  const { id } = await params
  const [organization, invoice] = await Promise.all([
    getFinanceOrganization(context.organizationId),
    getFinanceInvoice(context.organizationId, id),
  ])

  if (!organization || !invoice) notFound()

  const invoiceView: InvoiceView = {
    id: invoice.id,
    number: invoice.invoiceNo,
    franchiseName:
      invoice.franchisee.tradingName ?? invoice.franchisee.legalName,
    status: toInvoiceStatus(invoice.status),
    totalCents: Math.round(Number(invoice.total) * 100),
    amountPaidCents: Math.round(Number(invoice.amountPaid) * 100),
    currency: organization.currency,
    dueDateIso: invoice.dueDate.toISOString(),
    issuedAtIso: invoice.issueDate.toISOString(),
  }

  return (
    <div className="space-y-6">
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
        <div className="space-y-3">
          <InvoiceDetail invoice={invoiceView} />
          <section className="rounded-2xl border border-border bg-card/60 p-5">
            <h2 className="font-semibold">Contact</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {invoice.franchisee.email ?? "No contact email"}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
