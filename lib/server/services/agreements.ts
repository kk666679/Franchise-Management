import { prisma } from "@/lib/prisma"
import { assertOrganizationAccess } from "@lib/server/auth"
import type { AuthorizationContext } from "@lib/server/auth"
import { NotFoundError } from "@lib/server/errors"

export async function listAgreements(ctx: AuthorizationContext) {
  return prisma.franchiseAgreement.findMany({
    where: { organizationId: ctx.organizationId },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      agreementNo: true,
      status: true,
      signedAt: true,
      startDate: true,
      endDate: true,
      renewalDate: true,
      initialFee: true,
      royaltyRate: true,
      marketingRate: true,
      franchisee: { select: { id: true, legalName: true, tradingName: true } },
      brand: { select: { id: true, name: true } },
      location: { select: { id: true, name: true, code: true } },
    },
  })
}

export async function getAgreement(ctx: AuthorizationContext, id: string) {
  const record = await prisma.franchiseAgreement.findUnique({
    where: { id },
    select: {
      id: true,
      organizationId: true,
      agreementNo: true,
      status: true,
      signedAt: true,
      startDate: true,
      endDate: true,
      renewalDate: true,
      initialFee: true,
      royaltyRate: true,
      marketingRate: true,
      terms: true,
      createdAt: true,
      updatedAt: true,
      franchisee: { select: { id: true, legalName: true, tradingName: true, email: true } },
      brand: { select: { id: true, name: true } },
      location: { select: { id: true, name: true, code: true } },
      application: { select: { id: true, referenceNo: true, status: true } },
      invoices: {
        orderBy: { issueDate: "desc" },
        take: 10,
        select: { id: true, invoiceNo: true, status: true, total: true, amountPaid: true, dueDate: true },
      },
      documents: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, name: true, type: true, createdAt: true },
      },
    },
  })
  if (!record) throw new NotFoundError("Agreement not found")
  assertOrganizationAccess(ctx, record.organizationId)
  return record
}
