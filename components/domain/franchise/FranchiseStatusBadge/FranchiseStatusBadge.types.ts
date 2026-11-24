import type { FranchiseeStatus } from "@prisma/client"

export type FranchiseStatus = "draft" | "active" | "suspended" | "terminated"
export type FranchiseStatusBadgeStatus = FranchiseStatus | FranchiseeStatus
