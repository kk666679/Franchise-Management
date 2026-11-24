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
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectItem } from "@/components/ui/select"
import { branchFormSchema, type BranchFormValues } from "./BranchForm.schema"

export function BranchForm({
  mode,
  initial,
  franchises,
  onSubmit,
  onCancel,
}: {
  mode: "create" | "edit"
  initial?: Partial<BranchFormValues>
  franchises: { id: string; name: string }[]
  onSubmit: (v: BranchFormValues) => Promise<void>
  onCancel?: () => void
}) {
  const [isPending, startTransition] = useTransition()
  return (
    <Form<BranchFormValues>
      schema={branchFormSchema}
      defaultValues={{
        name: "",
        franchiseId: franchises[0]?.id ?? "",
        address: {
          line1: "",
          line2: "",
          city: "",
          region: "",
          postalCode: "",
          country: "US",
        },
        isActive: true,
        ...initial,
      }}
      onSubmit={(v) =>
        startTransition(async () => {
          await onSubmit(v)
        })
      }
    >
      <FormSection title="Branch">
        <FormField name="name" label="Branch name">
          <Input />
        </FormField>
        <FormField name="franchiseId" label="Franchise">
          <Select>
            {franchises.map((f) => (
              <SelectItem key={f.id} value={f.id}>
                {f.name}
              </SelectItem>
            ))}
          </Select>
        </FormField>
        <FormField name="isActive" label="Active">
          <Switch />
        </FormField>
      </FormSection>

      <FormSection title="Address">
        <FormField name="address.line1" label="Line 1">
          <Input />
        </FormField>
        <FormField name="address.line2" label="Line 2 (optional)">
          <Input />
        </FormField>
        <FormField name="address.city" label="City">
          <Input />
        </FormField>
        <FormField name="address.region" label="Region / State">
          <Input />
        </FormField>
        <FormField name="address.postalCode" label="Postal code">
          <Input />
        </FormField>
        <FormField name="address.country" label="Country (ISO-2)">
          <Input maxLength={2} />
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
          {mode === "create" ? "Create branch" : "Save changes"}
        </SubmitButton>
      </FormActions>
    </Form>
  )
}
