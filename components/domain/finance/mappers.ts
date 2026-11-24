export type InvoiceView = {
  id: string
  number: string
  franchiseName: string
  status: "draft" | "issued" | "partially_paid" | "paid" | "overdue" | "void"
  totalCents: number
  amountPaidCents: number
  currency: string
  dueDateIso: string
  issuedAtIso: string | null
}

export type PaymentView = {
  id: string
  invoiceNumber: string
  amountCents: number
  currency: string
  method: "card" | "bank_transfer" | "cash" | "other"
  status: "pending" | "completed" | "failed" | "refunded"
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
  status: "pending" | "calculated" | "invoiced" | "paid"
}

export type TaxRateView = {
  id: string
  name: string
  rateBps: number
  region: string
  isDefault: boolean
}

export function toInvoiceStatus(status: string): InvoiceView["status"] {
  switch (status) {
    case "DRAFT":
    case "draft":
      return "draft"
    case "ISSUED":
    case "issued":
      return "issued"
    case "PARTIALLY_PAID":
    case "partially_paid":
      return "partially_paid"
    case "PAID":
    case "paid":
      return "paid"
    case "OVERDUE":
    case "overdue":
      return "overdue"
    case "VOID":
    case "void":
      return "void"
    default:
      throw new Error(`Unsupported invoice status: ${status}`)
  }
}
