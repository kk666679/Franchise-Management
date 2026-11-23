export type ReconciliationItem = {
  id: string
  label: string
  matched: boolean
}

export type ReconciliationViewProps = {
  items: ReconciliationItem[]
}
