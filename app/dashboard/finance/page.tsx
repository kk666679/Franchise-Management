import { CircleDollarSign } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/feedback/empty-state"
import { InvoiceTable } from "@/components/domain/finance/InvoiceTable"
import {
  toInvoiceStatus,
  type InvoiceView,
} from "@/components/domain/finance/mappers"
import { getFinanceInvoices, getFinanceOrganization, requireFinanceRead } from "@lib/server/finance"

export default async function FinancePage() {
  const context = await requireFinanceRead()
  if (!context.organizationId) {
    return (
      <EmptyState
        title="Sign in required"
        description="Sign in to view organization finance records."
      />
    )
  }

  const [invoices, organization] = await Promise.all([
    getFinanceInvoices(context.organizationId),
    getFinanceOrganization(context.organizationId),
  ])
  const currency = organization?.currency ?? "USD"

  const outstanding = invoices
    .filter((i) => ["ISSUED", "PARTIALLY_PAID", "OVERDUE"].includes(i.status))
    .reduce((s, i) => s + (Number(i.total) - Number(i.amountPaid)), 0)

  const collected = invoices
    .filter((i) => i.status === "PAID")
    .reduce((s, i) => s + Number(i.total), 0)

  const currencyFmt = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  })

  const rows: InvoiceView[] = invoices.map((invoice) => ({
    id: invoice.id,
    number: invoice.invoiceNo,
    franchiseName:
      invoice.franchisee.tradingName ?? invoice.franchisee.legalName,
    status: toInvoiceStatus(invoice.status),
    totalCents: Math.round(Number(invoice.total) * 100),
    amountPaidCents: Math.round(Number(invoice.amountPaid) * 100),
    currency,
    dueDateIso: invoice.dueDate.toISOString(),
    issuedAtIso: invoice.issueDate.toISOString(),
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finance"
        description="Invoices, payments and royalty collection"
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(
          [
            ["Total invoices", String(invoices.length)],
            ["Outstanding", currencyFmt.format(outstanding)],
            ["Collected", currencyFmt.format(collected)],
            [
              "Overdue",
              String(invoices.filter((i) => i.status === "OVERDUE").length),
            ],
          ] as [string, string][]
        ).map(([label, value]) => (
          <div key={label} className="rounded-2xl p-4 glass">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      {invoices.length === 0 ? (
        <EmptyState
          title="No invoices yet"
          description="Invoices will appear here once created."
          icon={<CircleDollarSign className="size-5" />}
        />
      ) : (
        <InvoiceTable data={rows} />
      )}
    </div>
  )
}
