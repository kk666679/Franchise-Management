import { notFound } from "next/navigation"
import { FolderOpen } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { PERMISSIONS } from "@/lib/rbac"
import { getDocument } from "@lib/server/services/documents"
import { NotFoundError } from "@lib/server/errors"
import { prisma } from "@/lib/prisma"

const dateFmt = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
function formatBytes(bytes: bigint | null) {
  if (bytes === null) return "—"
  const n = Number(bytes)
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const organizationId = (await prisma.organization.findFirst({ select: { id: true } }))?.id ?? ""
  
  const ctx = { userId: "", organizationId, membershipRole: "OWNER" as const }
  let doc
  try { doc = await getDocument(ctx, id) } catch (e) { if (e instanceof NotFoundError) notFound(); throw e }

  return (
    <div className="space-y-6">
      <PageHeader title={doc.name} description={doc.contentType ?? "Document"} actions={<Badge variant="secondary">{doc.type}</Badge>} />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl p-6 glass">
          <h2 className="font-semibold">Metadata</h2>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            {[["Size", formatBytes(doc.sizeBytes)], ["Uploaded by", doc.uploadedBy?.name ?? doc.uploadedBy?.email ?? "—"], ["Created", dateFmt.format(doc.createdAt)], ["Updated", dateFmt.format(doc.updatedAt)], ["Expires", doc.expiresAt ? dateFmt.format(doc.expiresAt) : "—"], ["Checksum", doc.checksum ?? "—"]].map(([k, v]) => (
              <div key={k}><dt className="text-xs text-muted-foreground">{k}</dt><dd className="mt-0.5 font-medium break-all">{v}</dd></div>
            ))}
          </dl>
        </div>
        <div className="space-y-4 rounded-2xl p-6 glass">
          <h2 className="font-semibold">Linked records</h2>
          <dl className="space-y-3 text-sm">
            {[["Brand", doc.brand?.name ?? "—"], ["Franchisee", doc.franchisee?.tradingName ?? doc.franchisee?.legalName ?? "—"], ["Location", doc.location ? `${doc.location.name} (${doc.location.code})` : "—"], ["Agreement", doc.agreement?.agreementNo ?? "—"], ["Application", doc.application?.referenceNo ?? "—"], ["Storage key", doc.storageKey]].map(([k, v]) => (
              <div key={k}><dt className="text-xs text-muted-foreground">{k}</dt><dd className="mt-0.5 font-medium break-all">{v}</dd></div>
            ))}
          </dl>
        </div>
      </div>
      <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Document preview/download requires a signed storage URL from the document service. Metadata is shown above.
      </div>
    </div>
  )
}
