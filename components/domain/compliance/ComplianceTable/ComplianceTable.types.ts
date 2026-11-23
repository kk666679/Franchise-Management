import type { ComplianceView } from '../mappers'

export type ComplianceTableProps = {
  data: ComplianceView[]
  isLoading?: boolean
  emptyState?: React.ReactNode
}
