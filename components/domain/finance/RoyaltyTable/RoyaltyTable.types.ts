import type { RoyaltyView } from "../mappers"

export type RoyaltyTableProps = {
  data: RoyaltyView[]
  isLoading?: boolean
  emptyState?: React.ReactNode
}
