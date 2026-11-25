import type { FranchiseeStatus } from "@prisma/client"

/**
 * DTO types for the Franchise domain.
 *
 * These represent the raw data contract between the server (Prisma queries)
 * and the domain view-model mappers (`components/domain/franchise/mappers.ts`).
 * They are deliberately composite — a DTO may aggregate fields across multiple
 * Prisma models (e.g. Franchisee + Brand + location counts).
 */

export type FranchiseDTO = {
  id: string
  tradingName: string | null
  legalName: string
  status: FranchiseeStatus
  brand: { name: string } | null
  territory?: { name: string } | null
  locations: { id: string }[]
  createdAt: Date
}

export type BranchDTO = {
  id: string
  name: string
  code: string
  brandName: string | null
  franchiseName: string
  addressLine: string
  city: string
  region: string | null
  status: string
}

export type TerritoryDTO = {
  id: string
  name: string
  region: string
  franchise?: { name: string } | null
  conflicts: { id: string }[]
}

export type ContractDTO = {
  id: string
  agreementNo: string
  franchiseName: string
  status: string
  startDate: Date
  endDate: Date | null
  royaltyRate: number
  initialFeeCents: number
  currency: string
}
