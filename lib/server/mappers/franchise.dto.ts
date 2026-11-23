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
  name: string
  legalName: string
  status: FranchiseeStatus
  organization: { name: string }
  territory?: { name: string } | null
  _count: { branches: number }
  createdAt: Date
}

export type BranchDTO = {
  id: string
  name: string
  franchise: { name: string }
  address: { line1: string; city: string; region: string }
  isActive: boolean
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
  franchise: { name: string }
  status: string
  effectiveFrom: Date
  effectiveTo: Date | null
  royaltyRateBps: number
}
