import { notFound } from "next/navigation"
import { LifeBuoy } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { StatusIndicator } from "@/components/shared/status-indicator"
import { PERMISSIONS } from "@/lib/rbac"
import { getSupportTicket } from "@lib/server/services/support"
import { NotFoundError } from "@lib/server/errors"
import { prisma } from "@/lib/prisma"

const STATUS_TONE = { OPEN: "info", IN_PROGRESS: "warning", WAITING_ON_CUSTOMER: "warning", RESOLVED: "success", CLOSED: "neutral" } as const
const PRIORITY_TONE = { LOW: "neutral", NORMAL: "info", HIGH: "warning", URGENT: "danger" } as const
const dateFmt = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })

export default async function SupportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const organizationId = (await prisma.organization.findFirst({ select: { id: true } }))?.id ?? ""
  
  const ctx = { userId: "", organizationId, membershipRole: "OWNER" as const }
  let ticket
  try { ticket = await getSupportTicket(ctx, id) } catch (e) { if (e instanceof NotFoundError) notFound(); throw e }

  return (
    <div className="space-y-6">
        <PageHeader title={ticket.subject} description={`Ticket ${ticket.id.slice(0, 8)}`} actions={<div className="flex gap-2"><StatusIndicator label={ticket.priority} tone={PRIORITY_TONE[ticket.priority]} /><StatusIndicator label={ticket.status.replace(/_/g, " ")} tone={STATUS_TONE[ticket.status]} /></div>} />
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4 rounded-2xl p-6 glass">
            <h2 className="font-semibold">Description</h2>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{ticket.description}</p>
          </div>
          <div className="space-y-4 rounded-2xl p-6 glass">
            <h2 className="font-semibold">Details</h2>
            <dl className="space-y-3 text-sm">
              {[["Franchisee", ticket.franchisee?.tradingName ?? ticket.franchisee?.legalName ?? "—"], ["Location", ticket.location ? `${ticket.location.name} (${ticket.location.code})` : "—"], ["Created by", ticket.createdBy.name ?? ticket.createdBy.email], ["Assigned to", ticket.assignedTo?.name ?? ticket.assignedTo?.email ?? "Unassigned"], ["Created", dateFmt.format(ticket.createdAt)], ["Updated", dateFmt.format(ticket.updatedAt)], ["Resolved", ticket.resolvedAt ? dateFmt.format(ticket.resolvedAt) : "—"]].map(([k, v]) => (
                <div key={k}><dt className="text-xs text-muted-foreground">{k}</dt><dd className="mt-0.5 font-medium">{v}</dd></div>
              ))}
            </dl>
          </div>
        </div>
    </div>
  )
}
