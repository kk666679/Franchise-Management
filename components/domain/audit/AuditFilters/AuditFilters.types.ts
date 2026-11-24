export type AuditFilterValue = {
  actor?: string
  action?: string
  entityType?: string
}
export type AuditFiltersProps = {
  value: AuditFilterValue
  onChange: (value: AuditFilterValue) => void
}
