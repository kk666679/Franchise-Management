import Link from "next/link"
import { LifeBuoy } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/feedback/empty-state"
import { StatusIndicator } from "@/components/shared/status-indicator"
import { PERMISSIONS } from "@/lib/rbac"
import { listSupportTickets } from "@lib/server/services/support"
import { prisma } from "@/lib/prisma"

const STATUS_TONE = { OPEN: "info", IN_PROGRESS: "warning", WAITING_ON_CUSTOMER: "warning", RESOLVED: "success", CLOSED: "neutral" } as const
const PRIORITY_TONE = { LOW: "neutral", NORMAL: "info", HIGH: "warning", URGENT: "danger" } as const
const dateFmt = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" })

export default async function SupportPage() {
  const organizationId = (await prisma.organization.findFirst({ select: { id: true } }))?.id ?? ""
  
  const ctx = { userId: "", organizationId, membershipRole: "OWNER" as const }
  const tickets = await listSupportTickets(ctx)

  return (
    <div className="space-y-6">
        <PageHeader title="Support tickets" description={`${tickets.length} tickets`} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[["Open", tickets.filter((t) => t.status === "OPEN").length], ["In progress", tickets.filter((t) => t.status === "IN_PROGRESS").length], ["Waiting", tickets.filter((t) => t.status === "WAITING_ON_CUSTOMER").length], ["Resolved/Closed", tickets.filter((t) => ["RESOLVED", "CLOSED"].includes(t.status)).length]].map(([label, value]) => (
            <div key={String(label)} className="rounded-2xl p-4 glass"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p></div>
          ))}
        </div>
        {tickets.length === 0 ? (
          <EmptyState title="No support tickets" description="Support requests from franchisees will appear here." icon={<LifeBuoy className="size-5" />} />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-card/60">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[56rem] text-left text-sm">
                <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr><th className="px-4 py-3">Ticket</th><th className="px-4 py-3">Franchisee</th><th className="px-4 py-3">Priority</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Updated</th></tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3"><Link href={`/dashboard/support/${t.id}`} className="font-medium hover:text-primary">{t.subject}</Link><p className="text-xs text-muted-foreground line-clamp-1">{t.description}</p></td>
                      <td className="px-4 py-3 text-muted-foreground">{t.franchisee?.tradingName ?? t.franchisee?.legalName ?? "—"}</td>
                      <td className="px-4 py-3"><StatusIndicator label={t.priority} tone={PRIORITY_TONE[t.priority]} /></td>
                      <td className="px-4 py-3"><StatusIndicator label={t.status.replace(/_/g, " ")} tone={STATUS_TONE[t.status]} /></td>
                      <td className="px-4 py-3 text-muted-foreground">{dateFmt.format(t.updatedAt)}</td>
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
