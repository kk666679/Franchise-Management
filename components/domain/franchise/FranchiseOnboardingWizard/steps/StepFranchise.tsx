"use client"

import { FranchiseForm } from "../../FranchiseForm"
import type { FranchiseFormValues } from "../../FranchiseForm/FranchiseForm.schema"

export function StepFranchise({
  organizations,
  value,
  onBack,
  onNext,
}: {
  organizations: { id: string; name: string }[]
  value?: FranchiseFormValues
  onBack: () => void
  onNext: (v: FranchiseFormValues) => void
}) {
  return (
    <FranchiseForm
      mode="create"
      initial={value}
      organizations={organizations}
      territories={[]}
      onSubmit={async (v) => onNext(v)}
      onCancel={onBack}
    />
  )
}
