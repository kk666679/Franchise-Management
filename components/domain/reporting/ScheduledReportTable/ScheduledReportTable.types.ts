import type { ScheduledReportView } from '../mappers'

export type ScheduledReportTableProps = {
  data: ScheduledReportView[]
  isLoading?: boolean
  emptyState?: React.ReactNode
}
