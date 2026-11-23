export type AuditEventView = {
  id: string
  actorName: string
  action: string
  entityType: string
  entityId: string
  occurredAtIso: string
  summary: string
}
