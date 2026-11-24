import type { DocumentView } from "../mappers"

export type DocumentListProps = {
  data: DocumentView[]
  isLoading?: boolean
  emptyState?: React.ReactNode
}
