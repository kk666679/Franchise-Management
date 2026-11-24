import { prisma } from "@/lib/prisma"
import { assertOrganizationAccess } from "@lib/server/auth"
import type { AuthorizationContext } from "@lib/server/auth"
import { NotFoundError } from "@lib/server/errors"

export async function listSupportTickets(ctx: AuthorizationContext) {
  return prisma.supportTicket.findMany({
    where: { organizationId: ctx.organizationId },
    orderBy: { updatedAt: "desc" },
    take: 100,
    select: {
      id: true,
      subject: true,
      description: true,
      status: true,
      priority: true,
      createdAt: true,
      updatedAt: true,
      resolvedAt: true,
      franchisee: { select: { id: true, legalName: true, tradingName: true } },
      location: { select: { id: true, name: true, code: true } },
      createdBy: { select: { id: true, name: true, email: true } },
      assignedTo: { select: { id: true, name: true, email: true } },
    },
  })
}

export async function getSupportTicket(ctx: AuthorizationContext, id: string) {
  const record = await prisma.supportTicket.findUnique({
    where: { id },
    select: {
      id: true,
      organizationId: true,
      subject: true,
      description: true,
      status: true,
      priority: true,
      createdAt: true,
      updatedAt: true,
      resolvedAt: true,
      franchisee: { select: { id: true, legalName: true, tradingName: true } },
      location: { select: { id: true, name: true, code: true } },
      createdBy: { select: { id: true, name: true, email: true } },
      assignedTo: { select: { id: true, name: true, email: true } },
    },
  })
  if (!record) throw new NotFoundError("Support ticket not found")
  assertOrganizationAccess(ctx, record.organizationId)
  return record
}
