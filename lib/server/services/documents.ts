import { prisma } from "@/lib/prisma"
import { assertOrganizationAccess } from "@lib/server/auth"
import type { AuthorizationContext } from "@lib/server/auth"
import { NotFoundError } from "@lib/server/errors"

export async function listDocuments(ctx: AuthorizationContext) {
  return prisma.document.findMany({
    where: { organizationId: ctx.organizationId },
    orderBy: { updatedAt: "desc" },
    take: 100,
    select: {
      id: true,
      name: true,
      type: true,
      contentType: true,
      sizeBytes: true,
      createdAt: true,
      updatedAt: true,
      expiresAt: true,
      uploadedBy: { select: { id: true, name: true, email: true } },
      franchisee: { select: { id: true, legalName: true, tradingName: true } },
      agreement: { select: { id: true, agreementNo: true } },
    },
  })
}

export async function getDocument(ctx: AuthorizationContext, id: string) {
  const record = await prisma.document.findUnique({
    where: { id },
    select: {
      id: true,
      organizationId: true,
      name: true,
      type: true,
      contentType: true,
      sizeBytes: true,
      checksum: true,
      storageKey: true,
      createdAt: true,
      updatedAt: true,
      expiresAt: true,
      uploadedBy: { select: { id: true, name: true, email: true } },
      franchisee: { select: { id: true, legalName: true, tradingName: true } },
      brand: { select: { id: true, name: true } },
      location: { select: { id: true, name: true, code: true } },
      agreement: { select: { id: true, agreementNo: true } },
      application: { select: { id: true, referenceNo: true } },
    },
  })
  if (!record) throw new NotFoundError("Document not found")
  assertOrganizationAccess(ctx, record.organizationId)
  return record
}
