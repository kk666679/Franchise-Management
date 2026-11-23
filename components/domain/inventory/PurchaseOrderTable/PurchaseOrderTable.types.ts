import type { PurchaseOrderView } from '../mappers'

export type PurchaseOrderTableProps = {
  data: PurchaseOrderView[]
  isLoading?: boolean
  emptyState?: React.ReactNode
}
