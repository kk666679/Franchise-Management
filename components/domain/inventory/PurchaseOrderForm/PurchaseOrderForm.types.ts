export type PurchaseOrderFormValues = { supplierName: string; notes?: string }
export type PurchaseOrderFormProps = {
  initial?: Partial<PurchaseOrderFormValues>
  onSubmit: (values: PurchaseOrderFormValues) => Promise<void>
  onCancel?: () => void
}
