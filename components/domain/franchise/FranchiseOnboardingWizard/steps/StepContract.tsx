"use client"

import { ContractForm } from "../../ContractForm"
import type { ContractFormValues } from "../../ContractForm/ContractForm.schema"

export function StepContract({
  value,
  onBack,
  onNext,
}: {
  value?: ContractFormValues
  onBack: () => void
  onNext: (v: ContractFormValues) => void
}) {
  return (
    <ContractForm
      mode="create"
      initial={value}
      onSubmit={async (v) => onNext(v)}
      onCancel={onBack}
    />
  )
}
