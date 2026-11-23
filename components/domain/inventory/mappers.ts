export type ProductView = {
  id: string
  name: string
  sku: string
  category: string
  status: 'active' | 'archived'
  unitPriceCents: number
  currency: string
}

export type StockLevelView = {
  id: string
  productName: string
  sku: string
  locationName: string
  onHand: number
  reserved: number
  reorderPoint: number
}

export type StockMovementView = {
  id: string
  productName: string
  type: 'in' | 'out' | 'adjustment' | 'transfer'
  quantity: number
  occurredAtIso: string
  reference: string | null
}

export type PurchaseOrderView = {
  id: string
  number: string
  supplierName: string
  status: 'draft' | 'submitted' | 'received' | 'cancelled'
  totalCents: number
  currency: string
  orderedAtIso: string
}
