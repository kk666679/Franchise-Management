"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type {
  EmployeeFormProps,
  EmployeeFormValues,
} from "./EmployeeForm.types"

export function EmployeeForm({
  initial,
  onSubmit,
  onCancel,
}: EmployeeFormProps) {
  const [values, setValues] = useState<EmployeeFormValues>({
    fullName: initial?.fullName ?? "",
    email: initial?.email ?? "",
    role: initial?.role ?? "",
    branchId: initial?.branchId ?? "",
  })
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        void onSubmit(values)
      }}
    >
      <div className="space-y-1.5">
        <Label htmlFor="emp-name">Full name</Label>
        <Input
          id="emp-name"
          value={values.fullName}
          onChange={(e) => setValues({ ...values, fullName: e.target.value })}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="emp-email">Email</Label>
        <Input
          id="emp-email"
          type="email"
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="emp-role">Role</Label>
        <Input
          id="emp-role"
          value={values.role}
          onChange={(e) => setValues({ ...values, role: e.target.value })}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="emp-branch">Branch ID</Label>
        <Input
          id="emp-branch"
          value={values.branchId}
          onChange={(e) => setValues({ ...values, branchId: e.target.value })}
        />
      </div>
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">Save employee</Button>
      </div>
    </form>
  )
}
