"use client"

import { useTransition } from "react"
import {
  Form,
  FormField,
  FormSection,
  FormActions,
  SubmitButton,
} from "@/components/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  franchiseFormSchema,
  type FranchiseFormValues,
} from "./FranchiseForm.schema"
import type { FranchiseFormProps } from "./FranchiseForm.types"

export function FranchiseForm({
  mode,
  initial,
  organizations,
  territories,
  onSubmit,
  onCancel,
}: FranchiseFormProps) {
  const [isPending, startTransition] = useTransition()

  function handleSubmit(values: FranchiseFormValues) {
    startTransition(async () => {
      await onSubmit(values)
    })
  }

  return (
    <Form<FranchiseFormValues>
      schema={franchiseFormSchema}
      defaultValues={{
        name: "",
        legalName: "",
        organizationId: organizations[0]?.id ?? "",
        territoryId: null,
        notes: "",
        ...initial,
      }}
      onSubmit={handleSubmit}
    >
      <FormSection title="Identity">
        <FormField name="name" label="Franchise name">
          <Input placeholder="e.g. Acme North" autoComplete="off" />
        </FormField>
        <FormField name="legalName" label="Legal name">
          <Input placeholder="e.g. Acme North LLC" autoComplete="off" />
        </FormField>
      </FormSection>

      <FormSection title="Assignment">
        <FormField name="organizationId" label="Organization">
          <Select
            options={organizations.map((o) => ({ value: o.id, label: o.name }))}
            placeholder="Select organization"
          />
        </FormField>
        <FormField name="territoryId" label="Territory (optional)">
          <Select
            options={territories.map((t) => ({ value: t.id, label: t.name }))}
            placeholder="Unassigned"
            allowClear
          />
        </FormField>
      </FormSection>

      <FormSection title="Notes">
        <FormField name="notes" label="Notes (optional)">
          <Textarea rows={4} placeholder="Internal notes" />
        </FormField>
      </FormSection>

      <FormActions>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
        )}
        <SubmitButton pending={isPending}>
          {mode === "create" ? "Create franchise" : "Save changes"}
        </SubmitButton>
      </FormActions>
    </Form>
  )
}
