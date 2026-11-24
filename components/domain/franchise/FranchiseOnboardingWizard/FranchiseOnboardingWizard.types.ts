import type { FranchiseFormValues } from "../FranchiseForm/FranchiseForm.schema"
import type { TerritoryFormValues } from "../TerritoryForm/TerritoryForm.schema"
import type { ContractFormValues } from "../ContractForm/ContractForm.schema"

export type OnboardingValues = {
  organization: { name: string; legalName: string; taxId: string }
  franchise: FranchiseFormValues
  territory: TerritoryFormValues
  contract: ContractFormValues
}

export type OnboardingStep =
  "organization" | "franchise" | "territory" | "contract" | "review"
