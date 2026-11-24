import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/feedback/empty-state"
import { InvoiceTable } from "@/components/domain/finance/InvoiceTable"
import type { InvoiceView } from "@/components/domain/finance/mappers"
import { getFinanceInvoices, requireFinanceRead } from "@lib/server/finance"

const STATUS_MAP: Record<string, InvoiceView["status"]> = {
  DRAFT: "draft",
  ISSUED: "issued",
  PAID: "paid",
  OVERDUE: "overdue",
  VOID: "void",
  PARTIALLY_PAID: "issued",
}

export default async function FinanceInvoicesPage() {
  const context = await requireFinanceRead()
  if (!context.organizationId) {
    return (
      <PageAccessNotice
        title="Invoices"
        description="Sign in to view organization invoices."
      />
    )
  }

  const invoices = await getFinanceInvoices(context.organizationId)
  const rows: InvoiceView[] = invoices.map((inv) => ({
    id: inv.id,
    number: inv.invoiceNo,
    franchiseName: inv.franchisee.tradingName ?? inv.franchisee.legalName,
    status: STATUS_MAP[inv.status] ?? "draft",
    totalCents: Math.round(Number(inv.total) * 100),
    currency: "USD",
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

