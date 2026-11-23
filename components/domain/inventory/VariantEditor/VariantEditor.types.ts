export type VariantRow = { id: string; name: string; sku: string }
export type VariantEditorProps = { variants: VariantRow[]; onChange: (variants: VariantRow[]) => void }
