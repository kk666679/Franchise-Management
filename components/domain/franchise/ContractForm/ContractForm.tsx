'use client'

import { useTransition } from 'react'
import { Form, FormField, FormSection, FormActions, SubmitButton } from '@/components/form'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { contractFormSchema, type ContractFormValues } from './ContractForm.schema'

export function ContractForm({
  mode,
  initial,
  franchises,
  onSubmit,
  onCancel,
}: {
  mode: 'create' | 'edit'
  initial?: Partial<ContractFormValues>
  franchises?: { id: string; name: string }[]
  onSubmit: (v: ContractFormValues) => Promise<void>
  onCancel?: () => void
}) {
  const [isPending, startTransition] = useTransition()
  return (
    <Form<ContractFormValues>
      schema={contractFormSchema}
      defaultValues={{
        franchiseId: franchises?.[0]?.id ?? '',
        effectiveFrom: new Date().toISOString().slice(0, 10),
        effectiveTo: null,
        royaltyRatePct: 5,
        notes: '',
        ...initial,
      }}
      onSubmit={(v) => startTransition(async () => { await onSubmit(v) })}
    >
      <FormSection title="Term">
        {franchises && (
          <FormField name="franchiseId" label="Franchise">
            <Select options={franchises.map((f) => ({ value: f.id, label: f.name }))} />
          </FormField>
        )}
        <FormField name="effectiveFrom" label="Effective from">
          <Input type="date" />
        </FormField>
        <FormField name="effectiveTo" label="Effective to (optional)">
          <Input type="date" />
        </FormField>
      </FormSection>

      <FormSection title="Commercials">
        <FormField name="royaltyRatePct" label="Royalty rate (%)">
          <Input type="number" min={0} max={100} step={0.01} />
        </FormField>
        <FormField name="notes" label="Notes (optional)">
          <Textarea rows={3} />
        </FormField>
      </FormSection>

      <FormActions>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
        )}
        <SubmitButton pending={isPending}>
          {mode === 'create' ? 'Create contract' : 'Save changes'}
        </SubmitButton>
      </FormActions>
    </Form>
  )
}
