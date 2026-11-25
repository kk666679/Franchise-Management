import { prisma } from "@/lib/prisma";
import { assertOrganizationAccess, assertPermission } from "@lib/server/auth";
import type { AuthorizationContext } from "@lib/server/auth";
import { NotFoundError, ValidationError } from "@lib/server/errors";
import { PERMISSIONS } from "@/lib/rbac";
import { territoryCreateSchema, territoryUpdateSchema } from "./schemas";
import { writeGeoAuditLog } from "./audit";
import { validateGeometry } from "@/app/dashboard/location/_lib/validation";
import { polygonAreaSqKm, polygonPerimeterKm, centroid as calcCentroid, intersectionAreaSqM } from "@/app/dashboard/location/_lib/spatial";
import type { Polygon, MultiPolygon } from "geojson";

function toMultiPolygon(geometry: Polygon | MultiPolygon): MultiPolygon {
  if (geometry.type === "MultiPolygon") return geometry;
  return { type: "MultiPolygon", coordinates: [geometry.coordinates] };
}

function mapTerritory(row: any) {
  return {
    ...row,
    areaSqKm: row.areaSqKm === null ? null : Number(row.areaSqKm),
    perimeterKm: row.perimeterKm === null ? null : Number(row.perimeterKm),
    centroidLat: row.centroidLat === null ? null : Number(row.centroidLat),
    centroidLng: row.centroidLng === null ? null : Number(row.centroidLng),
    allowedOverlapSqM: row.allowedOverlapSqM === null ? null : Number(row.allowedOverlapSqM),
  };
}

async function computeTerritoryStats(geometry: Polygon | MultiPolygon) {
  const mp = toMultiPolygon(geometry);
  const feature = { type: "Feature" as const, properties: {}, geometry: mp };
  const areaSqKm = polygonAreaSqKm(feature);
  const perimeterKm = polygonPerimeterKm(feature);
  const [lng, lat] = calcCentroid(feature);
  return { areaSqKm, perimeterKm, centroidLng: lng, centroidLat: lat, multi: mp };
}

export async function listGeoTerritories(ctx: AuthorizationContext, params?: { status?: string; brandId?: string; search?: string; limit?: number }) {
  assertPermission(ctx, PERMISSIONS.BRANCH_READ);
  const where: any = { organizationId: ctx.organizationId };
  if (params?.status) where.status = params.status;
  if (params?.brandId) where.brandId = params.brandId;
  if (params?.search) where.OR = [{ name: { contains: params.search, mode: "insensitive" } }, { territoryCode: { contains: params.search, mode: "insensitive" } }];
  const rows = await prisma.geoTerritory.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: Math.min(params?.limit ?? 500, 1000),
    include: { brand: { select: { id: true, name: true } }, parent: { select: { id: true, name: true } }, _count: { select: { locations: true, assignments: true } } },
  });
  // geometry is Unsupported; fetch separately as GeoJSON
  const ids = rows.map((r) => r.id);
  const geomRows = ids.length ? await prisma.$queryRaw<Array<{ id: string; geojson: string }>>`
    SELECT id, ST_AsGeoJSON(geometry)::text as geojson FROM "GeoTerritory" WHERE id IN (${ids.length ? prisma.$queryRaw`${ids}` : ""})
  `.catch(() => []) : [];
  // fallback: fetch per id
  const geomMap = new Map<string, any>();
  for (const r of rows) {
    try {
      const g = await prisma.$queryRaw<Array<{ geojson: string }>>`SELECT ST_AsGeoJSON(geometry)::text as geojson FROM "GeoTerritory" WHERE id = ${r.id}`;
      if (g[0]?.geojson) geomMap.set(r.id, JSON.parse(g[0].geojson));
    } catch { /* no PostGIS or invalid */ }
  }
  return rows.map((r) => ({ ...mapTerritory(r), geometry: geomMap.get(r.id) ?? null }));
}

export async function getGeoTerritory(ctx: AuthorizationContext, id: string) {
  assertPermission(ctx, PERMISSIONS.BRANCH_READ);
  const row = await prisma.geoTerritory.findUnique({
    where: { id },
    include: { brand: { select: { id: true, name: true } }, parent: { select: { id: true, name: true } }, assignments: { include: { franchisee: { select: { id: true, legalName: true, tradingName: true } } } }, locations: { select: { id: true, name: true, code: true, status: true } } },
  });
  if (!row) throw new NotFoundError("Territory not found");
  assertOrganizationAccess(ctx, row.organizationId);
  let geometry: any = null;
  try {
    const g = await prisma.$queryRaw<Array<{ geojson: string }>>`SELECT ST_AsGeoJSON(geometry)::text as geojson FROM "GeoTerritory" WHERE id = ${id}`;
    if (g[0]?.geojson) geometry = JSON.parse(g[0].geojson);
  } catch {}
  return { ...mapTerritory(row), geometry };
}

export async function createGeoTerritory(ctx: AuthorizationContext, input: unknown) {
  assertPermission(ctx, PERMISSIONS.BRANCH_WRITE);
  const data = territoryCreateSchema.parse(input);
  const geomIssues = validateGeometry(data.geometry, "geometry");
  if (geomIssues.some((i) => i.level === "error")) throw new ValidationError(geomIssues.map((i) => i.message).join("; "));
  const stats = await computeTerritoryStats(data.geometry);
  const id = (await prisma.$queryRaw<Array<{ id: string }>>`SELECT gen_random_uuid()::text as id`.catch(() => [{ id: crypto.randomUUID() }]))[0].id;
  const now = new Date();
  const row = await prisma.$transaction(async (tx) => {
    // Prisma can't create this model because its required geometry field is Unsupported.
    await tx.$executeRaw`
      INSERT INTO "GeoTerritory" (
        "id","organizationId","name","territoryCode","parentTerritoryId","country","state","district",
        "territoryOwner","assignedMasterFranchiseId","assignedRegionalManagerId","territoryType","exclusivityStatus",
        "effectiveDate","expiryDate","status","geometry","areaSqKm","perimeterKm","centroidLat","centroidLng",
        "populationEstimate","existingOutletCount","plannedOutletCount","brandId","source","version","metadata",
        "allowedOverlapSqM","approvedOverlapIds","createdById","updatedById","createdAt","updatedAt"
      ) VALUES (
        ${id}, ${ctx.organizationId}, ${data.name}, ${data.territoryCode}, ${data.parentTerritoryId ?? null},
        ${data.country ?? null}, ${data.state ?? null}, ${data.district ?? null},
        ${data.territoryOwner ?? null}, ${data.assignedMasterFranchiseId ?? null}, ${data.assignedRegionalManagerId ?? null},
        ${data.territoryType}::"GeoTerritoryType", ${data.exclusivityStatus},
        ${data.effectiveDate ? new Date(data.effectiveDate) : null}, ${data.expiryDate ? new Date(data.expiryDate) : null},
        ${data.status}::"GeoTerritoryStatus",
        ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(stats.multi)}), 4326)::geometry(MultiPolygon,4326),
        ${stats.areaSqKm}, ${stats.perimeterKm}, ${stats.centroidLat}, ${stats.centroidLng},
        ${data.populationEstimate ?? null}, ${data.existingOutletCount ?? 0}, ${data.plannedOutletCount ?? 0},
        ${data.brandId ?? null}, 'MANUAL'::"GeoEntitySource", 1, ${data.metadata ? JSON.stringify(data.metadata) : null}::jsonb,
        ${data.allowedOverlapSqM ?? null}, ${data.approvedOverlapIds ? JSON.stringify(data.approvedOverlapIds) : null}::jsonb,
        ${ctx.userId || null}, ${ctx.userId || null}, ${now}, ${now}
      )
    `;
    const created = await tx.geoTerritory.findUnique({ where: { id } });
    if (!created) throw new Error("Failed to create territory");
    await writeGeoAuditLog({ organizationId: ctx.organizationId, entityType: "territory", entityId: id, action: "CREATE", actorId: ctx.userId, after: { ...created, geometry: stats.multi } }, tx);
    return created;
  });
  return { ...mapTerritory(row), geometry: stats.multi };
}

export async function updateGeoTerritory(ctx: AuthorizationContext, id: string, input: unknown) {
  assertPermission(ctx, PERMISSIONS.BRANCH_WRITE);
  const data = territoryUpdateSchema.parse(input);
  const existing = await prisma.geoTerritory.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Territory not found");
  assertOrganizationAccess(ctx, existing.organizationId);
  let stats: Awaited<ReturnType<typeof computeTerritoryStats>> | null = null;
  if (data.geometry) {
    const geomIssues = validateGeometry(data.geometry, "geometry");
    if (geomIssues.some((i) => i.level === "error")) throw new ValidationError(geomIssues.map((i) => i.message).join("; "));
    stats = await computeTerritoryStats(data.geometry);
  }
  const row = await prisma.$transaction(async (tx) => {
    const updated = await tx.geoTerritory.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.territoryCode !== undefined ? { territoryCode: data.territoryCode } : {}),
        ...(data.parentTerritoryId !== undefined ? { parentTerritoryId: data.parentTerritoryId } : {}),
        ...(data.country !== undefined ? { country: data.country } : {}),
        ...(data.state !== undefined ? { state: data.state } : {}),
        ...(data.district !== undefined ? { district: data.district } : {}),
        ...(data.territoryOwner !== undefined ? { territoryOwner: data.territoryOwner } : {}),
        ...(data.assignedMasterFranchiseId !== undefined ? { assignedMasterFranchiseId: data.assignedMasterFranchiseId } : {}),
        ...(data.assignedRegionalManagerId !== undefined ? { assignedRegionalManagerId: data.assignedRegionalManagerId } : {}),
        ...(data.territoryType !== undefined ? { territoryType: data.territoryType as any } : {}),
        ...(data.exclusivityStatus !== undefined ? { exclusivityStatus: data.exclusivityStatus } : {}),
        ...(data.effectiveDate !== undefined ? { effectiveDate: data.effectiveDate ? new Date(data.effectiveDate) : null } : {}),
        ...(data.expiryDate !== undefined ? { expiryDate: data.expiryDate ? new Date(data.expiryDate) : null } : {}),
        ...(data.status !== undefined ? { status: data.status as any } : {}),
        ...(data.brandId !== undefined ? { brandId: data.brandId } : {}),
        ...(data.populationEstimate !== undefined ? { populationEstimate: data.populationEstimate } : {}),
        ...(data.existingOutletCount !== undefined && data.existingOutletCount !== null
          ? { existingOutletCount: data.existingOutletCount }
          : {}),
        ...(data.plannedOutletCount !== undefined && data.plannedOutletCount !== null
          ? { plannedOutletCount: data.plannedOutletCount }
          : {}),
        ...(data.metadata !== undefined ? { metadata: data.metadata as any } : {}),
        ...(data.allowedOverlapSqM !== undefined ? { allowedOverlapSqM: data.allowedOverlapSqM as any } : {}),
        ...(data.approvedOverlapIds !== undefined ? { approvedOverlapIds: data.approvedOverlapIds as any } : {}),
        ...(stats ? { areaSqKm: stats.areaSqKm as any, perimeterKm: stats.perimeterKm as any, centroidLat: stats.centroidLat as any, centroidLng: stats.centroidLng as any } : {}),
        updatedById: ctx.userId || null,
        version: { increment: 1 },
      },
    });
    if (stats) {
      await tx.$executeRaw`UPDATE "GeoTerritory" SET geometry = ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(stats.multi)}), 4326)::geometry(MultiPolygon,4326) WHERE id = ${id}`;
    }
    await writeGeoAuditLog({ organizationId: ctx.organizationId, entityType: "territory", entityId: id, action: "UPDATE", actorId: ctx.userId, before: existing, after: updated }, tx);
    return updated;
  });
  let geometry: any = null;
  if (stats) geometry = stats.multi;
  else {
    try { const g = await prisma.$queryRaw<Array<{ geojson: string }>>`SELECT ST_AsGeoJSON(geometry)::text as geojson FROM "GeoTerritory" WHERE id = ${id}`; if (g[0]?.geojson) geometry = JSON.parse(g[0].geojson); } catch {}
  }
  return { ...mapTerritory(row), geometry };
}

export async function deleteGeoTerritory(ctx: AuthorizationContext, id: string) {
  assertPermission(ctx, PERMISSIONS.BRANCH_WRITE);
  const existing = await prisma.geoTerritory.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Territory not found");
  assertOrganizationAccess(ctx, existing.organizationId);
  await prisma.$transaction(async (tx) => {
    await tx.geoTerritory.delete({ where: { id } });
    await writeGeoAuditLog({ organizationId: ctx.organizationId, entityType: "territory", entityId: id, action: "DELETE", actorId: ctx.userId, before: existing }, tx);
  });
  return { deleted: true, id };
}

export async function detectTerritoryOverlaps(ctx: AuthorizationContext, territoryId?: string) {
  assertPermission(ctx, PERMISSIONS.BRANCH_READ);
  const territories = await listGeoTerritories(ctx, { limit: 1000 });
  const withGeom = territories.filter((t) => t.geometry);
  const overlaps: Array<{ territoryAId: string; territoryBId: string; territoryAName: string; territoryBName: string; overlapAreaSqM: number; exclusiveConflict: boolean }> = [];
  for (let i = 0; i < withGeom.length; i++) {
    for (let j = i + 1; j < withGeom.length; j++) {
      const a = withGeom[i], b = withGeom[j];
      if (territoryId && a.id !== territoryId && b.id !== territoryId) continue;
      const fa = { type: "Feature" as const, properties: {}, geometry: a.geometry } as any;
      const fb = { type: "Feature" as const, properties: {}, geometry: b.geometry } as any;
      const area = intersectionAreaSqM(fa, fb);
      if (area > 0.01) {
        const aExclusive = a.territoryType === "EXCLUSIVE" || a.exclusivityStatus === "EXCLUSIVE";
        const bExclusive = b.territoryType === "EXCLUSIVE" || b.exclusivityStatus === "EXCLUSIVE";
        overlaps.push({
          territoryAId: a.id, territoryBId: b.id, territoryAName: a.name, territoryBName: b.name,
          overlapAreaSqM: area,
          exclusiveConflict: aExclusive && bExclusive,
        });
      }
    }
  }
  return overlaps.sort((x, y) => y.overlapAreaSqM - x.overlapAreaSqM);
}
