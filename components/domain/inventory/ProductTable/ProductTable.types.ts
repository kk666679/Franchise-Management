import type { ProductView } from "../mappers"

export type ProductTableProps = {
  data: ProductView[]
  isLoading?: boolean
  emptyState?: React.ReactNode
}
