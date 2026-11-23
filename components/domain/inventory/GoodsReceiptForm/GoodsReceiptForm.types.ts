export type GoodsReceiptFormValues = { purchaseOrderId: string; receivedQty: number; reference?: string }
export type GoodsReceiptFormProps = { onSubmit: (values: GoodsReceiptFormValues) => Promise<void>; onCancel?: () => void }
