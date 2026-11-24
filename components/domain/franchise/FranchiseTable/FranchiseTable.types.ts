import type { FranchiseView } from "../mappers"

export type FranchiseTableProps = {
  data: FranchiseView[]
  isLoading?: boolean
  emptyState?: React.ReactNode
  onRowClick?: (id: string) => void
}
