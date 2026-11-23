'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { OnboardingValues } from '../FranchiseOnboardingWizard.types'

export function StepReview({
  values,
  onBack,
  onSubmit,
}: {
  values: OnboardingValues
  onBack: () => void
  onSubmit: () => Promise<void>
}) {
  return (
    <div className="space-y-4">
      <Card className="space-y-3 p-4">
        <h3 className="font-semibold">Organization</h3>
        <p>{values.organization.name} · {values.organization.legalName}</p>
        <h3 className="font-semibold">Franchise</h3>
        <p>{values.franchise.name} · {values.franchise.legalName}</p>
        <h3 className="font-semibold">Territory</h3>
        <p>{values.territory.name} · {values.territory.region}</p>
        <h3 className="font-semibold">Contract</h3>
        <p>Royalty {values.contract.royaltyRatePct}%</p>
      </Card>
      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={() => onSubmit()}>
          Create franchise
        </Button>
      </div>
    </div>
  )
}
