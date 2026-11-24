export type EmployeeFormValues = {
  fullName: string
  email: string
  role: string
  branchId: string
}
export type EmployeeFormProps = {
  initial?: Partial<EmployeeFormValues>
  onSubmit: (values: EmployeeFormValues) => Promise<void>
  onCancel?: () => void
}
