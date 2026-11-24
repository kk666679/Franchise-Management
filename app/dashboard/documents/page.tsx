import { FolderOpen } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/feedback/empty-state"
import { DocumentList } from "@/components/domain/documents/DocumentList"
import type { DocumentView } from "@/components/domain/documents/mappers"
import { PERMISSIONS } from "@/lib/rbac"
import { listDocuments } from "@lib/server/services/documents"
import { prisma } from "@/lib/prisma"

export default async function DocumentsPage() {
  const organizationId = (await prisma.organization.findFirst({ select: { id: true } }))?.id ?? ""
  
  const ctx = { userId: "", organizationId, membershipRole: "OWNER" as const }
  const documents = await listDocuments(ctx)

  const rows: DocumentView[] = documents.map((d) => ({
    id: d.id,
    name: d.name,
    category: d.type,
    version: 1,
    updatedAtIso: d.updatedAt.toISOString(),
    updatedBy: d.uploadedBy?.name ?? d.uploadedBy?.email ?? "Unknown",
    sizeBytes: d.sizeBytes ? Number(d.sizeBytes) : 0,
  }))

  return (
    <div className="space-y-6">
      <PageHeader title="Documents" description={`${documents.length} organization documents`} />
      {documents.length === 0 ? (
        <EmptyState title="No documents yet" description="Uploaded documents will appear here." icon={<FolderOpen className="size-5" />} />
      ) : (
        <DocumentList data={rows} />
      )}
    </div>
  )
}

