import type { AuditEventView } from "../mappers"

export type AuditTableProps = {
  data: AuditEventView[]
  isLoading?: boolean
  emptyState?: React.ReactNode
}
