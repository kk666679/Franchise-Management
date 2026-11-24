import { ClipboardCheck } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/feedback/empty-state"
import { AuditTable } from "@/components/domain/audit/AuditTable"
import type { AuditEventView } from "@/components/domain/audit/mappers"
import { PERMISSIONS } from "@/lib/rbac"
import { listAuditLogs } from "@lib/server/services/franchise"
import { prisma } from "@/lib/prisma"

export default async function AuditPage() {
  const organizationId = (await prisma.organization.findFirst({ select: { id: true } }))?.id ?? ""
  
  const ctx = { userId: "", organizationId, membershipRole: "OWNER" as const }
  const logs = await listAuditLogs(ctx, 100)

  const rows: AuditEventView[] = logs.map((log) => ({
    id: log.id,
    actorName: log.actor?.name ?? log.actor?.email ?? "System",
    action: log.action,
    entityType: log.entity,
    entityId: log.entityId,
    occurredAtIso: log.createdAt.toISOString(),
    summary: `${log.action} ${log.entity}`,
  }))

  return (
    <div className="space-y-6">
      <PageHeader title="Audit log" description="Recent organization activity and security-relevant events." />
      {logs.length === 0 ? (
        <EmptyState title="No audit events" description="Auditable actions will be recorded here." icon={<ClipboardCheck className="size-5" />} />
      ) : (
        <AuditTable data={rows} />
      )}
    </div>
  )
}

