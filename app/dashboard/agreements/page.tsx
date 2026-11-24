import Link from "next/link"
import { ScrollText } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/feedback/empty-state"
import { StatusIndicator } from "@/components/shared/status-indicator"
import { CurrencyDisplay } from "@/components/shared/currency-display"
import { PERMISSIONS } from "@/lib/rbac"
import { listAgreements } from "@lib/server/services/agreements"
import { prisma } from "@/lib/prisma"

const STATUS_TONE = {
  DRAFT: "neutral",
  PENDING_SIGNATURE: "warning",
  ACTIVE: "success",
  EXPIRED: "neutral",
  TERMINATED: "danger",
} as const

const dateFmt = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" })

export default async function AgreementsPage() {
  const organizationId = (await prisma.organization.findFirst({ select: { id: true } }))?.id ?? ""
  if (!organizationId) {
    return <PageAccessNotice title="Agreements" description="Sign in to view franchise agreements." />
  }
  const ctx = { userId: "", organizationId, membershipRole: "OWNER" as const }

  const [agreements, org] = await Promise.all([
    listAgreements(ctx),
    prisma.organization.findUnique({ where: { id: organizationId }, select: { currency: true } }),
  ])
  const currency = org?.currency ?? "USD"

  return (
    <div className="space-y-6">
<PageHeader title="Agreements" description={`${agreements.length} franchise agreements`} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Total", agreements.length],
            ["Active", agreements.filter((a) => a.status === "ACTIVE").length],
            ["Pending", agreements.filter((a) => a.status === "PENDING_SIGNATURE").length],
            ["Expired/Terminated", agreements.filter((a) => ["EXPIRED", "TERMINATED"].includes(a.status)).length],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-2xl p-4 glass">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
            </div>
          ))}
        </div>
        {agreements.length === 0 ? (
          <EmptyState title="No agreements yet" description="Franchise agreements will appear here." icon={<ScrollText className="size-5" />} />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-card/60">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[56rem] text-left text-sm">
                <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Agreement</th>
                    <th className="px-4 py-3 font-medium">Franchisee</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Term</th>
                    <th className="px-4 py-3 text-right font-medium">Royalty</th>
                    <th className="px-4 py-3 text-right font-medium">Initial fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {agreements.map((a) => (
                    <tr key={a.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <Link href={`/dashboard/agreements/${a.id}`} className="font-medium hover:text-primary">{a.agreementNo}</Link>
                        <p className="text-xs text-muted-foreground">{a.brand.name}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{a.franchisee.tradingName ?? a.franchisee.legalName}</td>
                      <td className="px-4 py-3"><StatusIndicator label={a.status.replace(/_/g, " ")} tone={STATUS_TONE[a.status]} /></td>
                      <td className="px-4 py-3 text-muted-foreground">{dateFmt.format(a.startDate)} – {a.endDate ? dateFmt.format(a.endDate) : "Open"}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{Number(a.royaltyRate).toFixed(2)}%</td>
                      <td className="px-4 py-3 text-right tabular-nums"><CurrencyDisplay value={Number(a.initialFee)} currency={currency} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  )
}
