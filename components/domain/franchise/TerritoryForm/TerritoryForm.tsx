'use client'

import { useTransition } from 'react'
import { Form, FormField, FormSection, FormActions, SubmitButton } from '@/components/form'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { territoryFormSchema, type TerritoryFormValues } from './TerritoryForm.schema'

export function TerritoryForm({
  mode,
  initial,
  onSubmit,
  onCancel,
}: {
  mode: 'create' | 'edit'
  initial?: Partial<TerritoryFormValues>
  onSubmit: (v: TerritoryFormValues) => Promise<void>
  onCancel?: () => void
}) {
  const [isPending, startTransition] = useTransition()
  return (
    <Form<TerritoryFormValues>
      schema={territoryFormSchema}
      defaultValues={{ name: '', region: '', ...initial }}
      onSubmit={(v) => startTransition(async () => { await onSubmit(v) })}
    >
      <FormSection title="Territory">
        <FormField name="name" label="Name"><Input /></FormField>
        <FormField name="region" label="Region"><Input /></FormField>
      </FormSection>
      <FormActions>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
        )}
        <SubmitButton pending={isPending}>
          {mode === 'create' ? 'Create territory' : 'Save changes'}
        </SubmitButton>
      </FormActions>
    </Form>
  )
}
