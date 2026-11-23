export type ProductFormValues = { name: string; sku: string; category: string; unitPriceCents: number; currency: string }
export type ProductFormProps = { initial?: Partial<ProductFormValues>; onSubmit: (values: ProductFormValues) => Promise<void>; onCancel?: () => void }
