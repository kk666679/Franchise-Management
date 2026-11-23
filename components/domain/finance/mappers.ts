export type InvoiceView = {
  id: string
  number: string
  franchiseName: string
  status: 'draft' | 'issued' | 'paid' | 'overdue' | 'void'
  totalCents: number
  currency: string
  dueDateIso: string
  issuedAtIso: string | null
}

export type PaymentView = {
  id: string
  invoiceNumber: string
  amountCents: number
  currency: string
  method: 'card' | 'bank_transfer' | 'cash' | 'other'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  receivedAtIso: string
}

export type RoyaltyView = {
  id: string
  franchiseName: string
  periodLabel: string
  grossSalesCents: number
  royaltyRateBps: number
  royaltyDueCents: number
  currency: string
  status: 'pending' | 'calculated' | 'invoiced' | 'paid'
}

export type TaxRateView = {
  id: string
  name: string
  rateBps: number
  region: string
  isDefault: boolean
}
