export type MoneyMinor = number

export type PosTenderType = "cash" | "card" | "softpos" | "wallet" | "other"

export type PosOrderType = "dine_in" | "takeaway" | "delivery"

export type PosSaleStatus =
  | "draft"
  | "held"
  | "finalized"
  | "voided"
  | "refunded"
  | "partially_refunded"

export type PosSyncStatus = "pending" | "syncing" | "synced" | "failed" | "conflict"

export type EdgeSignalKind = "fraud" | "upsell" | "stock" | "anomaly"

export type EdgeSignalSeverity = "info" | "warning" | "critical"

export interface PosProductView {
  id: string
  name: string
  sku: string
  priceCents: MoneyMinor
  currency: string
  inStock: number
  category?: string | null
  barcode?: string | null
  isActive?: boolean
}

export interface PosCartModifierView {
  id: string
  name: string
  priceCents: MoneyMinor
}

export interface PosCartItemView {
  id: string
  productId: string
  name: string
  quantity: number
  unitPriceCents: MoneyMinor
  currency: string
  modifiers?: PosCartModifierView[]
  discountCents?: MoneyMinor
  note?: string
  course?: "starter" | "main" | "dessert" | "beverage" | null
  seat?: string | null
}

export interface PosSessionView {
  id: string
  registerId: string
  openedAtIso: string
  closedAtIso: string | null
  openingFloatCents: MoneyMinor
  closingTotalCents: MoneyMinor | null
  currency: string
  cashierName?: string | null
  registerName?: string | null
}

export interface PosTenderLineView {
  id: string
  type: PosTenderType
  amountCents: MoneyMinor
  providerRef?: string | null
}

export interface PosHeldOrderView {
  id: string
  label: string
  itemCount: number
  totalCents: MoneyMinor
  currency: string
  createdAtIso: string
  orderType?: PosOrderType
}

export interface PosDiscountView {
  id: string
  code?: string | null
  label: string
  type: "percent" | "fixed"
  value: number
  amountCents: MoneyMinor
  scope: "item" | "order"
}

export interface PosCustomerView {
  id: string
  name: string
  phone?: string | null
  email?: string | null
  loyaltyPoints?: number
}

export interface PosReceiptLineView {
  id: string
  name: string
  quantity: number
  totalCents: MoneyMinor
  modifiers?: string[]
}

export interface PosReceiptView {
  receiptNumber: string
  currency: string
  totalCents: MoneyMinor
  subtotalCents?: MoneyMinor
  taxCents?: MoneyMinor
  discountCents?: MoneyMinor
  lines: PosReceiptLineView[]
  tenderLines?: PosTenderLineView[]
  cashierName?: string | null
  issuedAtIso?: string | null
}

export interface PosOutboxEntryView {
  id: string
  clientOpId: string
  status: PosSyncStatus
  retryCount: number
  lastError?: string | null
  createdAtIso: string
  updatedAtIso?: string | null
}

export interface PosEdgeSignalView {
  id: string
  kind: EdgeSignalKind
  severity: EdgeSignalSeverity
  message: string
  score?: number
  computedAtIso?: string
}

export interface PosTableView {
  id: string
  label: string
  seats: number
  status: "available" | "occupied" | "reserved" | "dirty"
  currentOrderId?: string | null
}

export interface PosRegisterView {
  id: string
  name: string
  branchName?: string | null
  status: "open" | "closed" | "offline"
}

export interface PosCashMovementView {
  id: string
  direction: "in" | "out"
  amountCents: MoneyMinor
  reason: string
  createdAtIso: string
}

export interface PosEndOfDayReportView {
  registerId: string
  registerName: string
  openedAtIso: string
  closedAtIso: string
  openingFloatCents: MoneyMinor
  cashSalesCents: MoneyMinor
  cardSalesCents: MoneyMinor
  otherSalesCents: MoneyMinor
  refundsCents: MoneyMinor
  expectedCashCents: MoneyMinor
  countedCashCents: MoneyMinor
  varianceCents: MoneyMinor
  currency: string
}

export interface AgentProposal {
  id: string
  kind: string
  summary: string
  requiresApproval: true
  payload: Record<string, unknown>
}
