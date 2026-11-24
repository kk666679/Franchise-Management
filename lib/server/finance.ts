import { prisma } from "@/lib/prisma"
import { PERMISSIONS } from "@/lib/rbac"
import { assertPermission, type AuthorizationContext } from "@lib/server/auth"
import { getCurrentSession } from "@lib/server/auth/session"

export async function requireFinanceRead(): Promise<AuthorizationContext> {
  const session = await getCurrentSession()
  const orgId = session?.org ?? ""
  if (!orgId)
    return {
      userId: "",
      organizationId: "",
      membershipRole: undefined,
    } as AuthorizationContext

  const context: AuthorizationContext = {
    userId: session?.sub ?? "",
    organizationId: orgId,
    membershipRole: session?.role ?? undefined,
  }

  assertPermission(context, PERMISSIONS.FINANCE_READ)
  return context
}

function startOfCurrentMonth() {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
}

export async function getFinanceSummary(organizationId: string) {
  const [invoiceTotals, successfulPayments, invoiceCounts] = await Promise.all([
    prisma.invoice.aggregate({
      where: { organizationId },
      _sum: { total: true, amountPaid: true },
    }),
    prisma.payment.aggregate({
      where: {
        organizationId,
        status: "SUCCEEDED",
        paidAt: { gte: startOfCurrentMonth() },
      },
      _sum: { amount: true },
    }),
    prisma.invoice.groupBy({
      by: ["status"],
      where: { organizationId },
      _count: { _all: true },
    }),
  ])

  const total = Number(invoiceTotals._sum.total ?? 0)
  const paid = Number(invoiceTotals._sum.amountPaid ?? 0)

  return {
    totalInvoiced: total,
    totalCollected: paid,
    outstanding: total - paid,
    collectedThisMonth: Number(successfulPayments._sum.amount ?? 0),
    invoiceCounts: invoiceCounts.map(({ status, _count }) => ({
      status,
      count: _count._all,
    })),
  }
}

export async function getFinanceOrganization(organizationId: string) {
  return prisma.organization.findUnique({
    where: { id: organizationId },
    select: { id: true, name: true, currency: true },
  })
}

export async function getFinanceInvoices(organizationId: string) {
  return prisma.invoice.findMany({
    where: { organizationId },
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
      franchisee: { select: { legalName: true, tradingName: true } },
    },
  })
}

export async function getFinanceInvoice(
  organizationId: string,
  invoiceId: string
) {
  return prisma.invoice.findFirst({
    where: { id: invoiceId, organizationId },
    select: {
      id: true,
      invoiceNo: true,
      status: true,
      issueDate: true,
      dueDate: true,
      subtotal: true,
      tax: true,
      total: true,
      amountPaid: true,
      notes: true,
      franchisee: {
        select: { legalName: true, tradingName: true, email: true },
      },
      lines: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          description: true,
          quantity: true,
          unitPrice: true,
          amount: true,
        },
      },
      payments: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          amount: true,
          method: true,
          status: true,
          paidAt: true,
          reference: true,
        },
      },
    },
  })
}

export async function getFinancePayments(organizationId: string) {
  return prisma.payment.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      reference: true,
      amount: true,
      method: true,
      status: true,
      paidAt: true,
      createdAt: true,
      invoice: {
        select: {
          invoiceNo: true,
          franchisee: { select: { legalName: true, tradingName: true } },
        },
      },
    },
  })
}
