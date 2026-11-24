import { notFound } from "next/navigation"
import { ScrollText } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { StatusIndicator } from "@/components/shared/status-indicator"
import { CurrencyDisplay } from "@/components/shared/currency-display"
import { Badge } from "@/components/ui/badge"
import { PERMISSIONS } from "@/lib/rbac"
import { getAgreement } from "@lib/server/services/agreements"
import { prisma } from "@/lib/prisma"
import { NotFoundError } from "@lib/server/errors"

const STATUS_TONE = { DRAFT: "neutral", PENDING_SIGNATURE: "warning", ACTIVE: "success", EXPIRED: "neutral", TERMINATED: "danger" } as const
const dateFmt = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" })

export default async function AgreementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const organizationId = (await prisma.organization.findFirst({ select: { id: true } }))?.id ?? ""
  
  const ctx = { userId: "", organizationId, membershipRole: "OWNER" as const }

  let agreement
  try { agreement = await getAgreement(ctx, id) } catch (e) { if (e instanceof NotFoundError) notFound(); throw e }

  const [granted, org] = await Promise.all([
    new Set(),
    prisma.organization.findUnique({ where: { id: organizationId }, select: { currency: true } }),
  ])
  const currency = org?.currency ?? "USD"

  return (
    <div className="space-y-6">
<PageHeader
          title={agreement.agreementNo}
          description={`${agreement.franchisee.tradingName ?? agreement.franchisee.legalName} · ${agreement.brand.name}`}
          actions={<StatusIndicator label={agreement.status.replace(/_/g, " ")} tone={STATUS_TONE[agreement.status]} />}
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-2xl p-6 glass">
            <h2 className="font-semibold">Agreement terms</h2>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              {[
                ["Start date", dateFmt.format(agreement.startDate)],
                ["End date", agreement.endDate ? dateFmt.format(agreement.endDate) : "Open-ended"],
                ["Signed", agreement.signedAt ? dateFmt.format(agreement.signedAt) : "Not signed"],
                ["Renewal", agreement.renewalDate ? dateFmt.format(agreement.renewalDate) : "—"],
                ["Royalty rate", `${Number(agreement.royaltyRate).toFixed(2)}%`],
                ["Marketing rate", `${Number(agreement.marketingRate).toFixed(2)}%`],
              ].map(([k, v]) => (
                <div key={k}><dt className="text-xs text-muted-foreground">{k}</dt><dd className="mt-0.5 font-medium">{v}</dd></div>
              ))}
              <div><dt className="text-xs text-muted-foreground">Initial fee</dt><dd className="mt-0.5 font-medium"><CurrencyDisplay value={Number(agreement.initialFee)} currency={currency} /></dd></div>
              <div><dt className="text-xs text-muted-foreground">Location</dt><dd className="mt-0.5 font-medium">{agreement.location ? `${agreement.location.name} (${agreement.location.code})` : "—"}</dd></div>
            </dl>
          </div>
          <div className="space-y-4 rounded-2xl p-6 glass">
            <h2 className="font-semibold">Related records</h2>
            <dl className="space-y-3 text-sm">
              <div><dt className="text-xs text-muted-foreground">Franchisee</dt><dd className="mt-0.5 font-medium">{agreement.franchisee.tradingName ?? agreement.franchisee.legalName}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Application</dt><dd className="mt-0.5 font-medium">{agreement.application ? `${agreement.application.referenceNo} (${agreement.application.status})` : "—"}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Documents</dt><dd className="mt-0.5 font-medium">{agreement.documents.length}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Invoices</dt><dd className="mt-0.5 font-medium">{agreement.invoices.length}</dd></div>
            </dl>
          </div>
        </div>
        {agreement.invoices.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-border bg-card/60">
            <div className="border-b border-border px-4 py-3 text-sm font-semibold">Recent invoices</div>
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr><th className="px-4 py-3">Invoice</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Total</th><th className="px-4 py-3">Due</th></tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {agreement.invoices.map((inv) => (
                  <tr key={inv.id}><td className="px-4 py-3 font-mono text-xs">{inv.invoiceNo}</td><td className="px-4 py-3"><Badge variant="secondary" className="text-xs">{inv.status}</Badge></td><td className="px-4 py-3 text-right"><CurrencyDisplay value={Number(inv.total)} currency={currency} /></td><td className="px-4 py-3 text-muted-foreground">{dateFmt.format(inv.dueDate)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  )
}
