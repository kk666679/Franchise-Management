import type { EmployeeView } from '../mappers'

export type EmployeeTableProps = {
  data: EmployeeView[]
  isLoading?: boolean
  emptyState?: React.ReactNode
}
