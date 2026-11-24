import type { InvoiceView } from "../mappers"

export type InvoiceTableProps = {
  data: InvoiceView[]
  isLoading?: boolean
  emptyState?: React.ReactNode
}
