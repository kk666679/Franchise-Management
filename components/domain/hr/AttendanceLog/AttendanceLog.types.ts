import type { AttendanceView } from "../mappers"

export type AttendanceLogProps = {
  data: AttendanceView[]
  isLoading?: boolean
  emptyState?: React.ReactNode
}
