import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/feedback/empty-state"
import { InvoiceTable } from "@/components/domain/finance/InvoiceTable"
import {
  toInvoiceStatus,
  type InvoiceView,
} from "@/components/domain/finance/mappers"
import {
  getFinanceInvoices,
  getFinanceOrganization,
  requireFinanceRead,
} from "@lib/server/finance"

export default async function FinanceInvoicesPage() {
  const context = await requireFinanceRead()
  if (!context.organizationId) {
    return (
      <EmptyState
        title="Sign in required"
        description="Sign in to view organization invoices."
      />
    )
  }

  const [invoices, organization] = await Promise.all([
    getFinanceInvoices(context.organizationId),
    getFinanceOrganization(context.organizationId),
  ])
  const currency = organization?.currency ?? "USD"
  const rows: InvoiceView[] = invoices.map((inv) => ({
    id: inv.id,
    number: inv.invoiceNo,
    franchiseName: inv.franchisee.tradingName ?? inv.franchisee.legalName,
    status: toInvoiceStatus(inv.status),
    totalCents: Math.round(Number(inv.total) * 100),
    amountPaidCents: Math.round(Number(inv.amountPaid) * 100),
    currency,
    dueDateIso: inv.dueDate.toISOString(),
    issuedAtIso: inv.issueDate.toISOString(),
  }))

  return (
    <div className="space-y-6">
      <PageHeader title="Invoices" description={`${invoices.length} recent invoices`} />
      {rows.length === 0 ? (
        <EmptyState title="No invoices yet" description="Invoices will appear here when created." />
      ) : (
        <InvoiceTable data={rows} />
      )}
    </div>
  )
}

