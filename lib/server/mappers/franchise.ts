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
    name: record.legalName,
    legalName: record.legalName,
    status: record.status,
    organization: { name: record.brand.name },
    territory: record.brand ? { name: record.brand.name } : null,
    _count: { branches: record.locations.length },
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
      name: true,
      addressLine1: true,
      city: true,
      state: true,
      status: true,
      franchisee: { select: { legalName: true } },
    },
  })

  if (!record) throw new Error("Branch not found")
  assertOrganizationAccess(ctx, record.organizationId)

  return {
    id: record.id,
    name: record.name,
    franchise: { name: record.franchisee?.legalName ?? "" },
    address: {
      line1: record.addressLine1,
      city: record.city,
      region: record.state ?? "",
    },
    isActive: record.status === "ACTIVE",
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
      agreementNo: true,
      status: true,
      startDate: true,
      endDate: true,
      royaltyRate: true,
      franchisee: { select: { legalName: true } },
    },
  })

  if (!record) throw new Error("Contract not found")
  assertOrganizationAccess(ctx, record.organizationId)

  return {
    id: record.id,
    franchise: { name: record.franchisee.legalName },
    status: record.status,
    effectiveFrom: record.startDate,
    effectiveTo: record.endDate,
    royaltyRateBps: Number(record.royaltyRate) * 100,
  } as ContractDTO
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
    name: r.legalName,
    legalName: r.legalName,
    status: r.status,
    organization: { name: r.brand.name },
    territory: r.brand ? { name: r.brand.name } : null,
    _count: { branches: r.locations.length },
    createdAt: r.createdAt,
  }))
}
