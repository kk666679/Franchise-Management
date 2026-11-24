import type { DocumentVersionView } from "../mappers"

export type DocumentVersionListProps = {
  data: DocumentVersionView[]
  isLoading?: boolean
  emptyState?: React.ReactNode
}
