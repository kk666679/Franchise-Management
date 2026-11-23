export type ComplianceFormValues = { title: string; category: string; ownerId: string; dueDateIso?: string }
export type ComplianceFormProps = { initial?: Partial<ComplianceFormValues>; onSubmit: (values: ComplianceFormValues) => Promise<void>; onCancel?: () => void }
