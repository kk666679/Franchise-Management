import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/feedback/empty-state"
import {
  getFinanceOrganization,
  getFinancePayments,
  requireFinanceRead,
} from "@lib/server/finance"

export default async function FinancePaymentsPage() {
  const context = await requireFinanceRead()
  if (!context.organizationId) {
    return (
      <EmptyState
        title="Sign in required"
        description="Sign in to view organization payment records."
      />
    )
  }

  const [organization, payments] = await Promise.all([
    getFinanceOrganization(context.organizationId),
    getFinancePayments(context.organizationId),
  ])
  if (!organization) {
    return (
      <EmptyState
        title="Organization not found"
        description="No organization is available for this account."
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        description={`${payments.length} recent payment records`}
      />
      {payments.length === 0 ? (
        <EmptyState
          title="No payments yet"
          description="Payment records will appear here when recorded."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card/60">
          <table className="w-full min-w-[52rem] text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Invoice</th>
                <th className="px-4 py-3">Franchisee</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-4 py-3">{payment.reference ?? "—"}</td>
                  <td className="px-4 py-3">{payment.invoice.invoiceNo}</td>
                  <td className="px-4 py-3">
                    {payment.invoice.franchisee.tradingName ??
                      payment.invoice.franchisee.legalName}
                  </td>
                  <td className="px-4 py-3">{payment.method}</td>
                  <td className="px-4 py-3">{payment.status}</td>
                  <td className="px-4 py-3 text-right">
                    {payment.amount.toString()} {organization.currency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
