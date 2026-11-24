import type { FranchiseFormValues } from "./FranchiseForm.schema"

export type FranchiseFormProps = {
  mode: "create" | "edit"
  initial?: Partial<FranchiseFormValues>
  organizations: { id: string; name: string }[]
  territories: { id: string; name: string }[]
  onSubmit: (values: FranchiseFormValues) => Promise<void>
  onCancel?: () => void
}
