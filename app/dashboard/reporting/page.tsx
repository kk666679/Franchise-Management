import { FileBarChart2 } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/feedback/empty-state"
import { ReportPreview } from "@/components/domain/reporting/ReportPreview"
import { PERMISSIONS } from "@/lib/rbac"
import { prisma } from "@/lib/prisma"

export default async function ReportingPage() {
  const organizationId = (await prisma.organization.findFirst({ select: { id: true } }))?.id ?? ""
  
  const ctx = { userId: "", organizationId, membershipRole: "OWNER" as const }

  const rows: Record<string, unknown>[] = []

  return (
    <div className="space-y-6">
      <PageHeader title="Reporting" description="Operational and financial reports, exports, and scheduled deliveries." />
      {rows.length > 0 ? (
        <ReportPreview rows={rows} />
      ) : (
        <EmptyState
          title="No reports configured"
          description="Reporting domain components are integrated. Report/ScheduledReport persistence models are not present yet; this route is ready for schema wiring."
          icon={<FileBarChart2 className="size-5" />}
        />
      )}
    </div>
  )
}

