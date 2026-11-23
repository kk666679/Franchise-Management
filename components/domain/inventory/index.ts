// Domain: inventory — READINESS: UI SCAFFOLD (no StockLevel/StockMovement/PurchaseOrder Prisma models yet — blocked on Phase 9 schema)
// Scoped barrel — do not re-export across domains.
export { ProductTable } from './ProductTable'
export { ProductForm } from './ProductForm'
export { VariantEditor } from './VariantEditor'
export { StockLevelBadge } from './StockLevelBadge'
export { StockMovementLedger } from './StockMovementLedger'
export { StockAdjustDialog } from './StockAdjustDialog'
export { LowStockBadge } from './LowStockBadge'
export { PurchaseOrderTable } from './PurchaseOrderTable'
export { PurchaseOrderForm } from './PurchaseOrderForm'
export { GoodsReceiptForm } from './GoodsReceiptForm'
export * from './mappers'
