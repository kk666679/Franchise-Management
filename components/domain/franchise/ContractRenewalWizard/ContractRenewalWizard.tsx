'use client'

import { useTransition } from 'react'
import { Form, FormField, FormSection, FormActions, SubmitButton } from '@/components/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { contractRenewalSchema, type ContractRenewalValues } from './ContractRenewalWizard.schema'

export function ContractRenewalWizard({
  currentRoyaltyPct,
  onRenew,
  onCancel,
}: {
  currentRoyaltyPct: number
  onRenew: (v: ContractRenewalValues) => Promise<void>
  onCancel?: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const today = new Date().toISOString().slice(0, 10)
  const nextYear = new Date(Date.now() + 365 * 864e5).toISOString().slice(0, 10)
  return (
    <Form<ContractRenewalValues>
      schema={contractRenewalSchema}
      defaultValues={{
        effectiveFrom: today,
        effectiveTo: nextYear,
        royaltyRatePct: currentRoyaltyPct,
        notes: '',
      }}
      onSubmit={(v) => startTransition(async () => { await onRenew(v) })}
    >
      <FormSection title="New term">
        <FormField name="effectiveFrom" label="Effective from"><Input type="date" /></FormField>
        <FormField name="effectiveTo" label="Effective to"><Input type="date" /></FormField>
      </FormSection>
      <FormSection title="Commercials">
        <FormField name="royaltyRatePct" label="Royalty rate (%)">
          <Input type="number" min={0} max={100} step={0.01} />
        </FormField>
        <FormField name="notes" label="Notes (optional)"><Textarea rows={3} /></FormField>
      </FormSection>
      <FormActions>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>Cancel</Button>
        )}
        <SubmitButton pending={isPending}>Renew contract</SubmitButton>
      </FormActions>
    </Form>
  )
}
