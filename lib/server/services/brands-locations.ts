import { prisma } from "@/lib/prisma"
import { assertOrganizationAccess } from "@lib/server/auth"
import type { AuthorizationContext } from "@lib/server/auth"
import { NotFoundError } from "@lib/server/errors"

export async function listBrands(ctx: AuthorizationContext) {
  return prisma.franchiseBrand.findMany({
    where: { organizationId: ctx.organizationId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      description: true,
      foundedYear: true,
      createdAt: true,
      _count: { select: { franchisees: true, locations: true, agreements: true } },
    },
  })
}

export async function getBrand(ctx: AuthorizationContext, id: string) {
  const record = await prisma.franchiseBrand.findUnique({
    where: { id },
    include: {
      franchisees: {
        orderBy: { createdAt: "desc" },
        take: 20,
        select: { id: true, legalName: true, tradingName: true, status: true },
      },
      locations: {
        orderBy: { createdAt: "desc" },
        take: 20,
        select: { id: true, name: true, code: true, status: true, city: true },
      },
      agreements: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, agreementNo: true, status: true, startDate: true, endDate: true },
      },
    },
  })
  if (!record) throw new NotFoundError("Brand not found")
  assertOrganizationAccess(ctx, record.organizationId)
  return record
}

export async function listLocations(ctx: AuthorizationContext) {
  return prisma.franchiseLocation.findMany({
    where: { organizationId: ctx.organizationId },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      name: true,
      code: true,
      status: true,
      addressLine1: true,
      city: true,
      state: true,
      postalCode: true,
      country: true,
      openedAt: true,
      brand: { select: { id: true, name: true } },
      franchisee: { select: { id: true, legalName: true, tradingName: true } },
    },
  })
}

export async function getLocation(ctx: AuthorizationContext, id: string) {
  const record = await prisma.franchiseLocation.findUnique({
    where: { id },
    include: {
      brand: { select: { id: true, name: true } },
      franchisee: { select: { id: true, legalName: true, tradingName: true } },
      agreements: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, agreementNo: true, status: true, startDate: true, endDate: true },
      },
      documents: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, name: true, type: true, createdAt: true },
      },
    },
  })
  if (!record) throw new NotFoundError("Location not found")
  assertOrganizationAccess(ctx, record.organizationId)
  return record
}
