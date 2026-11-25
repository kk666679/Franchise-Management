'use client'

import { useTransition } from 'react'
import { Form, FormField, FormSection, FormActions, SubmitButton } from '@/components/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { organizationFormSchema, type OrganizationFormValues } from './OrganizationForm.schema'

export function OrganizationForm({
  mode, initial, onSubmit, onCancel,
}: {
  mode: 'create' | 'edit'
  initial?: Partial<OrganizationFormValues>
  onSubmit: (v: OrganizationFormValues) => Promise<void>
  onCancel?: () => void
}) {
  const [isPending, startTransition] = useTransition()
  return (
    <Form<OrganizationFormValues>
      schema={organizationFormSchema}
      defaultValues={{ name: '', legalName: '', taxId: '', notes: '', ...initial }}
      onSubmit={(v) => startTransition(async () => { await onSubmit(v) })}
    >
      <FormSection title="Identity">
        <FormField name="name" label="Organization name"><Input /></FormField>
        <FormField name="legalName" label="Legal name"><Input /></FormField>
        <FormField name="taxId" label="Tax ID"><Input /></FormField>
      </FormSection>
      <FormSection title="Notes">
        <FormField name="notes" label="Notes (optional)"><Textarea rows={4} /></FormField>
      </FormSection>
      <FormActions>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>Cancel</Button>
        )}
        <SubmitButton pending={isPending}>
          {mode === 'create' ? 'Create organization' : 'Save changes'}
        </SubmitButton>
      </FormActions>
    </Form>
  )
}
