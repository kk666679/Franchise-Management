'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormField, FormActions, SubmitButton } from '@/components/form'
import { Input } from '@/components/ui/input'

const schema = z.object({
  name: z.string().min(1).max(120),
  legalName: z.string().min(1).max(200),
  taxId: z.string().min(1).max(50),
})
export type StepOrganizationValues = z.infer<typeof schema>

export function StepOrganization({
  value,
  onNext,
}: {
  value?: StepOrganizationValues
  onNext: (v: StepOrganizationValues) => void
}) {
  const form = useForm<StepOrganizationValues>({
    resolver: zodResolver(schema),
    defaultValues: value ?? { name: '', legalName: '', taxId: '' },
  })
  return (
    <Form {...form} schema={schema} onSubmit={onNext}>
      <FormField name="name" label="Organization name">
        <Input />
      </FormField>
      <FormField name="legalName" label="Legal name">
        <Input />
      </FormField>
      <FormField name="taxId" label="Tax ID">
        <Input />
      </FormField>
      <FormActions>
        <SubmitButton>Continue</SubmitButton>
      </FormActions>
    </Form>
  )
}
