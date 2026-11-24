export type PaymentFormValues = {
  invoiceId: string
  amountCents: number
  method: "card" | "bank_transfer" | "cash" | "other"
}

export type PaymentFormProps = {
  initial?: Partial<PaymentFormValues>
  onSubmit: (values: PaymentFormValues) => Promise<void>
  onCancel?: () => void
}
