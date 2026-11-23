import type {
  FranchiseDTO,
  BranchDTO,
  TerritoryDTO,
  ContractDTO,
} from '@/lib/server/mappers/franchise.dto'

/** View-model — what the UI actually renders. Never includes internal IDs or raw status enums. */
export type FranchiseView = {
  id: string
  name: string
  legalName: string
  status: FranchiseDTO['status']
  organizationName: string
  territoryName: string | null
  branchCount: number
  createdAtIso: string
}

export type BranchView = {
  id: string
  name: string
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
  franchiseName: string
  status: string
  effectiveFromIso: string
  effectiveToIso: string | null
  royaltyRatePct: number
}

export function toFranchiseView(dto: FranchiseDTO): FranchiseView {
  return {
    id: dto.id,
    name: dto.name,
    legalName: dto.legalName,
    status: dto.status,
    organizationName: dto.organization.name,
    territoryName: dto.territory?.name ?? null,
    branchCount: dto._count.branches,
    createdAtIso: dto.createdAt.toISOString(),
  }
}

export function toBranchView(dto: BranchDTO): BranchView {
  return {
    id: dto.id,
    name: dto.name,
    franchiseName: dto.franchise.name,
    addressLine: dto.address.line1,
    city: dto.address.city,
    region: dto.address.region,
    isActive: dto.isActive,
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
    franchiseName: dto.franchise.name,
    status: dto.status,
    effectiveFromIso: dto.effectiveFrom.toISOString(),
    effectiveToIso: dto.effectiveTo?.toISOString() ?? null,
    royaltyRatePct: dto.royaltyRateBps / 100,
  }
}
