import { Prisma } from '@prisma/client'
/** Centralized audit logging for the Franchise Management platform.
 *
 * Logs all create, update, delete, login, invite, and export actions with
 * full context (actor, organization, entity, changes, IP, user agent).
 * These records are immutable and time-stamped.
 */

import { prisma } from "@/lib/prisma"
import type { AuditAction } from "@prisma/client"

/** Create an audit log entry for a server-side action. */
export async function logAction(params: {
  organizationId: string
  actorId?: string | null
  action: AuditAction
  entity: string
  entityId: string
  changes?: Record<string, unknown> | null
  ipAddress?: string | null
  userAgent?: string | null
}) {
  return prisma.auditLog.create({
    data: {
      organizationId: params.organizationId,
      actorId: params.actorId,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
      changes: params.changes === null ? Prisma.DbNull : (params.changes as Prisma.InputJsonValue),
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    },
  })
}

/** Convenience wrapper for common create operations. */
export async function logCreate(params: {
  organizationId: string
  actorId?: string | null
  entity: string
  entityId: string
  changes?: Record<string, unknown> | null
}) {
  return logAction({ ...params, action: "CREATE" })
}

/** Convenience wrapper for common update operations. */
export async function logUpdate(params: {
  organizationId: string
  actorId?: string | null
  entity: string
  entityId: string
  changes: Record<string, unknown>
}) {
  return logAction({ ...params, action: "UPDATE" })
}

/** Convenience wrapper for common delete operations. */
export async function logDelete(params: {
  organizationId: string
  actorId?: string | null
  entity: string
  entityId: string
  changes?: Record<string, unknown> | null
}) {
  return logAction({ ...params, action: "DELETE" })
}

/** Log a login event. */
export async function logLogin(params: {
  organizationId: string
  actorId?: string | null
  ipAddress?: string | null
  userAgent?: string | null
}) {
  return logAction({
    ...params,
    action: "LOGIN",
    entity: "User",
    entityId: params.actorId ?? "unknown",
  })
}

/** Log an invite event. */
export async function logInvite(params: {
  organizationId: string
  actorId?: string | null
  targetEmail: string
  ipAddress?: string | null
  userAgent?: string | null
}) {
  return logAction({
    ...params,
    action: "INVITE",
    entity: "UserInvite",
    entityId: params.targetEmail,
    changes: { targetEmail: params.targetEmail },
  })
}

/** Log an export event. */
export async function logExport(params: {
  organizationId: string
  actorId?: string | null
  entity: string
  entityId?: string | null
  ipAddress?: string | null
  userAgent?: string | null
}) {
  return logAction({
    ...params,
    action: "EXPORT",
    entity: params.entity,
    entityId: params.entityId ?? "export",
  })
}