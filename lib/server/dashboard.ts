import { prisma } from "@/lib/prisma"

export type DashboardData = {
  organization: { id: string; name: string; currency: string }
  metrics: {
    brands: number
    activeLocations: number
    franchisees: number
    outstandingBalance: number
    collectedThisMonth: number
  }
  revenue: Array<{ label: string; value: number }>
  applications: Array<{
    id: string
    referenceNo: string
    status: string
    brandName: string
    franchiseeName: string
    submittedAt: Date | null
  }>
}

function dayLabel(date: Date) {
  return new Intl.DateTimeFormat("en", { weekday: "short" }).format(date)
}

export async function getDashboardData(organizationId: string): Promise<DashboardData | null> {
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { id: true, name: true, currency: true },
  })

  if (!organization) return null

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const sevenDaysAgo = new Date(now)
  sevenDaysAgo.setHours(0, 0, 0, 0)
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)

  const [brands, activeLocations, franchisees, invoiceTotals, monthPayments, recentPayments, applications] =
    await Promise.all([
      prisma.franchiseBrand.count({ where: { organizationId, status: "ACTIVE" } }),
      prisma.franchiseLocation.count({ where: { organizationId, status: "ACTIVE" } }),
      prisma.franchisee.count({ where: { organizationId, status: "ACTIVE" } }),
      prisma.invoice.aggregate({
        where: {
          organizationId,
          status: { in: ["ISSUED", "PARTIALLY_PAID", "OVERDUE"] },
        },
        _sum: { total: true, amountPaid: true },
      }),
      prisma.payment.aggregate({
        where: {
          organizationId,
          status: "SUCCEEDED",
          paidAt: { gte: monthStart },
        },
        _sum: { amount: true },
      }),
      prisma.payment.findMany({
        where: {
          organizationId,
          status: "SUCCEEDED",
          paidAt: { gte: sevenDaysAgo },
        },
        select: { amount: true, paidAt: true },
      }),
      prisma.franchiseApplication.findMany({
        where: { organizationId },
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: {
          id: true,
          referenceNo: true,
          status: true,
          submittedAt: true,
          brand: { select: { name: true } },
          franchisee: { select: { legalName: true, tradingName: true } },
        },
      }),
    ])

  const revenue = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(sevenDaysAgo)
    date.setDate(sevenDaysAgo.getDate() + index)
    const dayStart = new Date(date)
    const dayEnd = new Date(date)
    dayEnd.setDate(dayEnd.getDate() + 1)

    const value = recentPayments
      .filter((payment) => payment.paidAt && payment.paidAt >= dayStart && payment.paidAt < dayEnd)
      .reduce((total, payment) => total + Number(payment.amount), 0)

    return { label: dayLabel(date), value }
  })

  return {
    organization,
    metrics: {
      brands,
      activeLocations,
      franchisees,
      outstandingBalance: Number(invoiceTotals._sum.total ?? 0) - Number(invoiceTotals._sum.amountPaid ?? 0),
      collectedThisMonth: Number(monthPayments._sum.amount ?? 0),
    },
    revenue,
    applications: applications.map((application) => ({
      id: application.id,
      referenceNo: application.referenceNo,
      status: application.status,
      brandName: application.brand.name,
      franchiseeName: application.franchisee?.tradingName ?? application.franchisee?.legalName ?? "Unassigned applicant",
      submittedAt: application.submittedAt,
    })),
  }
}
