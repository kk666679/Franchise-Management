import { prisma } from "@/lib/prisma"
import type { AuthorizationContext } from "@/lib/server/auth"
import { assertOrganizationAccess } from "@/lib/server/auth"
import type {
  BranchDTO,
  ContractDTO,
  FranchiseDTO,
  TerritoryDTO,
} from "./franchise.dto"

/**
 * Map a Prisma Franchisee (with brand + location aggregates) to a FranchiseDTO.
 */
export async function toFranchiseDTO(
  ctx: AuthorizationContext,
  id: string
): Promise<FranchiseDTO> {
  const record = await prisma.franchisee.findUnique({
    where: { id },
    select: {
      id: true,
      organizationId: true,
      legalName: true,
      tradingName: true,
      status: true,
      createdAt: true,
      brand: { select: { name: true } },
      locations: { select: { id: true }, where: { status: "ACTIVE" } },
    },
  })

  if (!record) throw new Error("Franchisee not found")
  assertOrganizationAccess(ctx, record.organizationId)

  return {
    id: record.id,
    tradingName: record.tradingName,
    legalName: record.legalName,
    status: record.status,
    brand: record.brand ? { name: record.brand.name } : null,
    territory: record.brand ? { name: record.brand.name } : null,
    locations: record.locations,
    createdAt: record.createdAt,
  }
}

/**
 * Map a Prisma FranchiseLocation (with franchisee join) to a BranchDTO.
 */
export async function toBranchDTO(
  ctx: AuthorizationContext,
  id: string
): Promise<BranchDTO> {
  const record = await prisma.franchiseLocation.findUnique({
    where: { id },
    select: {
      id: true,
      organizationId: true,
      name: true,
      addressLine1: true,
      city: true,
      state: true,
      status: true,
      code: true,
      brand: { select: { name: true } },
      franchisee: { select: { legalName: true } },
    },
  })

  if (!record) throw new Error("Branch not found")
  assertOrganizationAccess(ctx, record.organizationId)

  return {
    id: record.id,
    name: record.name,
    code: record.code,
    brandName: record.brand?.name ?? null,
    franchiseName: record.franchisee?.legalName ?? "",
    addressLine: record.addressLine1,
    city: record.city,
    region: record.state,
    status: record.status,
  }
}

/**
 * Map a Prisma FranchiseBrand to a TerritoryDTO.
 */
export async function toTerritoryDTO(
  ctx: AuthorizationContext,
  id: string
): Promise<TerritoryDTO> {
  const record = await prisma.franchiseBrand.findUnique({
    where: { id },
    select: {
      id: true,
      organizationId: true,
      name: true,
      status: true,
      franchisees: { select: { id: true } },
    },
  })

  if (!record) throw new Error("Territory not found")
  assertOrganizationAccess(ctx, record.organizationId)

  return {
    id: record.id,
    name: record.name,
    region: record.status,
    franchise: record.franchisees.length > 0 ? { name: record.name } : null,
    conflicts: record.franchisees.map((f) => ({ id: f.id })),
  }
}

/**
 * Map a Prisma FranchiseAgreement to a ContractDTO.
 */
export async function toContractDTO(
  ctx: AuthorizationContext,
  id: string
): Promise<ContractDTO> {
  const record = await prisma.franchiseAgreement.findUnique({
    where: { id },
    select: {
      id: true,
      organizationId: true,
      agreementNo: true,
      status: true,
      startDate: true,
      endDate: true,
      royaltyRate: true,
      initialFee: true,
      franchisee: { select: { legalName: true } },
      organization: { select: { currency: true } },
    },
  })

  if (!record) throw new Error("Contract not found")
  assertOrganizationAccess(ctx, record.organizationId)

  return {
    id: record.id,
    agreementNo: record.agreementNo,
    franchiseName: record.franchisee.legalName,
    status: record.status,
    startDate: record.startDate,
    endDate: record.endDate,
    royaltyRate: Number(record.royaltyRate),
    initialFeeCents: Math.round(Number(record.initialFee) * 100),
    currency: record.organization.currency,
  }
}

/**
 * List FranchiseDTOs for the current organization.
 */
export async function listFranchiseDTOs(
  ctx: AuthorizationContext
): Promise<FranchiseDTO[]> {
  const records = await prisma.franchisee.findMany({
    where: { organizationId: ctx.organizationId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      legalName: true,
      tradingName: true,
      status: true,
      createdAt: true,
      brand: { select: { name: true } },
      locations: { select: { id: true }, where: { status: "ACTIVE" } },
    },
  })

  return records.map((r) => ({
    id: r.id,
    tradingName: r.tradingName,
    legalName: r.legalName,
    status: r.status,
    brand: r.brand ? { name: r.brand.name } : null,
    territory: r.brand ? { name: r.brand.name } : null,
    locations: r.locations,
    createdAt: r.createdAt,
  }))
}
