"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useOnboardingState } from "./useOnboardingState"
import { StepOrganization } from "./steps/StepOrganization"
import { StepFranchise } from "./steps/StepFranchise"
import { StepTerritory } from "./steps/StepTerritory"
import { StepContract } from "./steps/StepContract"
import { StepReview } from "./steps/StepReview"
import type { OnboardingValues } from "./FranchiseOnboardingWizard.types"

export function FranchiseOnboardingWizard({
  organizations,
  onSubmit,
}: {
  organizations: { id: string; name: string }[]
  onSubmit: (values: OnboardingValues) => Promise<void>
}) {
  const { step, steps, values, next, back, merge } = useOnboardingState()
  const pct = Math.round(((steps.indexOf(step) + 1) / steps.length) * 100)

  return (
    <div className="space-y-6">
      <Progress value={pct} aria-label={`Onboarding progress: ${pct}%`} />

      {step === "organization" && (
        <StepOrganization
          value={values.organization}
          onNext={(v) => {
            merge("organization", v)
            next()
          }}
        />
      )}

      {step === "franchise" && (
        <StepFranchise
          organizations={organizations}
          value={values.franchise}
          onBack={back}
          onNext={(v) => {
            merge("franchise", v)
            next()
          }}
        />
      )}

      {step === "territory" && (
        <StepTerritory
          value={values.territory}
          onBack={back}
          onNext={(v) => {
            merge("territory", v)
            next()
          }}
        />
      )}

      {step === "contract" && (
        <StepContract
          value={values.contract}
          onBack={back}
          onNext={(v) => {
            merge("contract", v)
            next()
          }}
        />
      )}

      {step === "review" && (
        <StepReview
          values={values as OnboardingValues}
          onBack={back}
          onSubmit={() => onSubmit(values as OnboardingValues)}
        />
      )}

      <div className="flex justify-end">
        <Button
          variant="ghost"
          type="button"
          onClick={back}
          disabled={steps.indexOf(step) === 0}
        >
          Back
        </Button>
      </div>
    </div>
  )
}
