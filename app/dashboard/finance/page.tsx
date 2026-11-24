import { CircleDollarSign, Download } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { StatusIndicator } from "@/components/shared/status-indicator"
import { CurrencyDisplay } from "@/components/shared/currency-display"
import { EmptyState } from "@/components/feedback/empty-state"
import { Button } from "@/components/ui/button"
import { PERMISSIONS } from "@/lib/rbac"
import { listInvoices } from "@lib/server/services/franchise"
import { prisma } from "@/lib/prisma"

const STATUS_TONE = {
  DRAFT: "neutral",
  ISSUED: "info",
  PARTIALLY_PAID: "warning",
  PAID: "success",
  OVERDUE: "danger",
  VOID: "neutral",
} as const

const STATUS_LABEL = {
  DRAFT: "Draft",
  ISSUED: "Issued",
  PARTIALLY_PAID: "Partial",
  PAID: "Paid",
  OVERDUE: "Overdue",
  VOID: "Void",
} as const

const dateFmt = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

export default async function FinancePage() {
  const organizationId = (await prisma.organization.findFirst({ select: { id: true } }))?.id ?? ""
  

  const ctx = {
    userId: "",
    organizationId: organizationId,
    membershipRole: "OWNER",
  }

  const [invoices, org] = await Promise.all([
    listInvoices(ctx),
    prisma.organization.findUnique({
      where: { id: organizationId },
      select: { currency: true },
    }),
  ])
  const granted = new Set()
  const currency = org?.currency ?? "USD"

  const outstanding = invoices
    .filter((i) => ["ISSUED", "PARTIALLY_PAID", "OVERDUE"].includes(i.status))
    .reduce((s, i) => s + (Number(i.total) - Number(i.amountPaid)), 0)

  const collected = invoices
    .filter((i) => i.status === "PAID")
    .reduce((s, i) => s + Number(i.total), 0)

  const currencyFmt = new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  })

  return (
    <div className="space-y-6">
<PageHeader
          title="Finance"
          description="Invoices, payments and royalty collection"
          actions={
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              disabled
            >
              <Download className="size-4" />
              Export
            </Button>
          }
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
              <p className="mt-1 text-2xl font-semibold tabular-nums">
                {value}
              </p>
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
          <div className="overflow-hidden rounded-2xl border border-border bg-card/60">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[52rem] text-left text-sm">
                <thead className="border-b border-border bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-3 font-medium">Invoice</th>
                    <th className="px-4 py-3 font-medium">Franchisee</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Total</th>
                    <th className="px-4 py-3 text-right font-medium">Paid</th>
                    <th className="px-4 py-3 font-medium">Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {invoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-3 font-medium tabular-nums">
                        {inv.invoiceNo}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {inv.franchisee.tradingName ?? inv.franchisee.legalName}
                      </td>
                      <td className="px-4 py-3">
                        <StatusIndicator
                          label={STATUS_LABEL[inv.status]}
                          tone={STATUS_TONE[inv.status]}
                        />
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        <CurrencyDisplay
                          value={Number(inv.total)}
                          currency={currency}
                        />
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        <CurrencyDisplay
                          value={Number(inv.amountPaid)}
                          currency={currency}
                        />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {dateFmt.format(inv.dueDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
              {invoices.length} invoice{invoices.length !== 1 ? "s" : ""}
            </div>
          </div>
        )}
    </div>
  )
}
