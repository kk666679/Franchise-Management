import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type GeoAuditInput = {
  organizationId: string;
  entityType: string;
  entityId: string;
  action: string;
  actorId?: string | null;
  actorName?: string | null;
  before?: unknown;
  after?: unknown;
  metadata?: unknown;
};

export async function writeGeoAuditLog(input: GeoAuditInput, tx?: Prisma.TransactionClient) {
  const client = tx ?? prisma;
  return client.geoAuditLog.create({
    data: {
      organizationId: input.organizationId,
      entityType: input.entityType,
      entityId: input.entityId,
      action: input.action,
      actorId: input.actorId ?? null,
      actorName: input.actorName ?? null,
      before: (input.before ?? null) as any,
      after: (input.after ?? null) as any,
      metadata: (input.metadata ?? null) as any,
    },
  });
}

export async function listGeoAuditLogs(organizationId: string, entityType?: string, entityId?: string, limit = 50) {
  return prisma.geoAuditLog.findMany({
    where: {
      organizationId,
      ...(entityType ? { entityType } : {}),
      ...(entityId ? { entityId } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: Math.min(Math.max(limit, 1), 200),
  });
}
