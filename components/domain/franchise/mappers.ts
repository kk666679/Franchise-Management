import type {
  FranchiseDTO,
  OrganizationDTO,
  BranchDTO,
  TerritoryDTO,
  ContractDTO,
} from '@/lib/server/mappers/franchise.dto'
import type { ContractStatus } from './ContractLifecycleBadge'

export type FranchiseView = {
  id: string
  name: string
  legalName: string
  status: FranchiseDTO['status']
  brandName: string | null
  organizationName: string
  territoryName: string | null
  branchCount: number
  createdAtIso: string
}

export type OrganizationView = {
  id: string
  name: string
  legalName: string
  status: OrganizationDTO['status']
  franchiseCount: number
  branchCount: number
  createdAtIso: string
}

export type BranchView = {
  id: string
  name: string
  code: string
  brandName: string | null
  franchiseName: string
  addressLine: string
  city: string
  region: string
  isActive: boolean
}

export type TerritoryView = {
  id: string
  name: string
  region: string
  franchiseName: string | null
  hasConflict: boolean
}

export type ContractView = {
  id: string
  agreementNo: string
  franchiseName: string
  status: string
  effectiveFromIso: string
  effectiveToIso: string | null
  royaltyRatePct: number
  initialFeeCents: number
  currency: string
}

export function toContractStatus(status: string): ContractStatus {
  const map: Record<string, ContractStatus> = {
    DRAFT: "draft",
    PENDING_SIGNATURE: "pending_approval",
    ACTIVE: "active",
    EXPIRED: "expired",
    TERMINATED: "terminated",
  }
  const mapped = map[String(status).toUpperCase() as keyof typeof map]
  if (mapped === undefined) {
    throw new Error(`Unsupported contract status: ${status}`)
  }
  return mapped
}

export function toFranchiseView(dto: FranchiseDTO): FranchiseView {
  return {
    id: dto.id,
    name: dto.tradingName ?? dto.legalName,
    legalName: dto.legalName,
    status: dto.status,
    brandName: dto.brand?.name ?? null,
    organizationName: dto.organizationName ?? "",
    territoryName: dto.territory?.name ?? null,
    branchCount: dto.locations.length,
    createdAtIso: dto.createdAt.toISOString(),
  }
}

export function toOrganizationView(dto: OrganizationDTO): OrganizationView {
  return {
    id: dto.id,
    name: dto.name,
    legalName: dto.legalName,
    status: dto.status,
    franchiseCount: dto._count.franchises,
    branchCount: dto._count.branches,
    createdAtIso: dto.createdAt.toISOString(),
  }
}

export function toBranchView(dto: BranchDTO): BranchView {
  return {
    id: dto.id,
    name: dto.name,
    code: dto.code,
    brandName: dto.brandName,
    franchiseName: dto.franchiseName,
    addressLine: dto.addressLine,
    city: dto.city,
    region: dto.region ?? "",
    isActive: dto.status === "ACTIVE",
  }
}

export function toTerritoryView(dto: TerritoryDTO): TerritoryView {
  return {
    id: dto.id,
    name: dto.name,
    region: dto.region,
    franchiseName: dto.franchise?.name ?? null,
    hasConflict: dto.conflicts.length > 0,
  }
}

export function toContractView(dto: ContractDTO): ContractView {
  return {
    id: dto.id,
    agreementNo: dto.agreementNo,
    franchiseName: dto.franchiseName,
    status: dto.status,
    effectiveFromIso: dto.startDate.toISOString(),
    effectiveToIso: dto.endDate?.toISOString() ?? null,
    royaltyRatePct: dto.royaltyRate,
    initialFeeCents: dto.initialFeeCents,
    currency: dto.currency,
  }
}

