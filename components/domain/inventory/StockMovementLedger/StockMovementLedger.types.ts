import type { StockMovementView } from '../mappers'

export type StockMovementLedgerProps = {
  data: StockMovementView[]
  isLoading?: boolean
  emptyState?: React.ReactNode
}
