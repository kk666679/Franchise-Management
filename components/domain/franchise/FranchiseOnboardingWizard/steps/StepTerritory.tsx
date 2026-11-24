"use client"

import { TerritoryForm } from "../../TerritoryForm"
import type { TerritoryFormValues } from "../../TerritoryForm/TerritoryForm.schema"

export function StepTerritory({
  value,
  onBack,
  onNext,
}: {
  value?: TerritoryFormValues
  onBack: () => void
  onNext: (v: TerritoryFormValues) => void
}) {
  return (
    <TerritoryForm
      mode="create"
      initial={value}
      onSubmit={async (v) => onNext(v)}
      onCancel={onBack}
    />
  )
}
