export type PosProductView = {
  id: string
  name: string
  sku: string
  priceCents: number
  currency: string
  inStock: number
}

export type PosCartItemView = {
  id: string
  productId: string
  name: string
  quantity: number
  unitPriceCents: number
  currency: string
}

export type PosSessionView = {
  id: string
  registerId: string
  openedAtIso: string
  closedAtIso: string | null
  openingFloatCents: number
  closingTotalCents: number | null
  currency: string
}
