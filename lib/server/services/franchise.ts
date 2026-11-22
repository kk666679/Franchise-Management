import { prisma } from "@/lib/prisma"
import { assertOrganizationAccess } from "@lib/server/auth"
import type { AuthorizationContext } from "@lib/server/auth"
import { NotFoundError } from "@lib/server/errors"

export async function listFranchisees(ctx: AuthorizationContext) {
  return prisma.franchisee.findMany({
    where: { organizationId: ctx.organizationId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      legalName: true,
      tradingName: true,
      status: true,
      email: true,
      phone: true,
      createdAt: true,
      brand: { select: { id: true, name: true } },
      locations: { select: { id: true }, where: { status: "ACTIVE" } },
      _count: { select: { agreements: true, invoices: true } },
    },
  })
}

export async function getFranchisee(ctx: AuthorizationContext, id: string) {
  const record = await prisma.franchisee.findUnique({
    where: { id },
    include: {
      brand: { select: { id: true, name: true } },
      contacts: { orderBy: { isPrimary: "desc" } },
      locations: { orderBy: { createdAt: "desc" } },
      agreements: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          agreementNo: true,
          status: true,
          startDate: true,
          endDate: true,
          royaltyRate: true,
        },
      },
      invoices: {
        orderBy: { issueDate: "desc" },
        take: 10,
        select: {
          id: true,
          invoiceNo: true,
          status: true,
          total: true,
          amountPaid: true,
          dueDate: true,
        },
      },
    },
  })

  if (!record) throw new NotFoundError("Franchisee not found")
  assertOrganizationAccess(ctx, record.organizationId)
  return record
}

export async function listApplications(ctx: AuthorizationContext) {
  return prisma.franchiseApplication.findMany({
    where: { organizationId: ctx.organizationId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      referenceNo: true,
      status: true,
      submittedAt: true,
      updatedAt: true,
      brand: { select: { id: true, name: true } },
      franchisee: { select: { id: true, legalName: true, tradingName: true } },
    },
  })
}

export async function listInvoices(ctx: AuthorizationContext) {
  return prisma.invoice.findMany({
    where: { organizationId: ctx.organizationId },
    orderBy: { issueDate: "desc" },
    take: 100,
    select: {
      id: true,
      invoiceNo: true,
      status: true,
      issueDate: true,
      dueDate: true,
      total: true,
      amountPaid: true,
      franchisee: { select: { id: true, legalName: true, tradingName: true } },
      agreement: { select: { id: true, agreementNo: true } },
    },
  })
}

export async function listAuditLogs(ctx: AuthorizationContext, limit = 50) {
  return prisma.auditLog.findMany({
    where: { organizationId: ctx.organizationId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      action: true,
      entity: true,
      entityId: true,
      createdAt: true,
      actor: { select: { id: true, name: true, email: true } },
    },
  })
}
