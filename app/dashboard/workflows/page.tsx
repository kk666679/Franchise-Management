import { Workflow } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/feedback/empty-state"
import { ApprovalInbox } from "@/components/domain/workflows/ApprovalInbox"
import type { ApprovalView } from "@/components/domain/workflows/mappers"
import { PERMISSIONS } from "@/lib/rbac"
import { prisma } from "@/lib/prisma"

export default async function WorkflowsPage() {
  const organizationId = (await prisma.organization.findFirst({ select: { id: true } }))?.id ?? ""
  
  const ctx = { userId: "", organizationId, membershipRole: "OWNER" as const }

  // No Approval Prisma model yet; render domain inbox with empty state-ready data.
  const approvals: ApprovalView[] = []

  return (
    <div className="space-y-6">
      <PageHeader title="Workflows & approvals" description="Approval queues, decision trails, and workflow status." />
      {approvals.length === 0 ? (
        <EmptyState
          title="No pending approvals"
          description="Approval/workflow domain components are integrated. Approval persistence models are not present in Prisma yet; this route will populate when Phase 9 workflow schema is added."
          icon={<Workflow className="size-5" />}
        />
      ) : (
        <ApprovalInbox approvals={approvals} />
      )}
    </div>
  )
}

