import { prisma } from "@/lib/prisma";
import { assertOrganizationAccess, assertPermission } from "@lib/server/auth";
import type { AuthorizationContext } from "@lib/server/auth";
import { NotFoundError, ValidationError } from "@lib/server/errors";
import { PERMISSIONS } from "@/lib/rbac";
import { locationCreateSchema, locationUpdateSchema } from "./schemas";
import { writeGeoAuditLog } from "./audit";
import { validatePosition } from "@/app/dashboard/location/_lib/validation";

function mapLocation(row: any) {
  return {
    ...row,
    latitude: row.latitude === null ? null : Number(row.latitude),
    longitude: row.longitude === null ? null : Number(row.longitude),
    storeSize: row.storeSize === null ? null : Number(row.storeSize),
  };
}

export async function listGeoLocations(ctx: AuthorizationContext, params?: {
  search?: string; locationType?: string; businessStatus?: string; brandId?: string; franchiseeId?: string; assignedTerritoryId?: string; limit?: number;
}) {
  assertPermission(ctx, PERMISSIONS.BRANCH_READ);
  const where: any = { organizationId: ctx.organizationId };
  if (params?.locationType) where.locationType = params.locationType;
  if (params?.businessStatus) where.status = params.businessStatus;
  if (params?.brandId) where.brandId = params.brandId;
  if (params?.franchiseeId) where.franchiseeId = params.franchiseeId;
  if (params?.assignedTerritoryId) where.assignedTerritoryId = params.assignedTerritoryId;
  if (params?.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { code: { contains: params.search, mode: "insensitive" } },
      { city: { contains: params.search, mode: "insensitive" } },
      { addressLine1: { contains: params.search, mode: "insensitive" } },
      { postalCode: { contains: params.search, mode: "insensitive" } },
    ];
  }
  const rows = await prisma.franchiseLocation.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: Math.min(params?.limit ?? 500, 1000),
    include: {
      brand: { select: { id: true, name: true } },
      franchisee: { select: { id: true, legalName: true, tradingName: true } },
      assignedTerritory: { select: { id: true, name: true, territoryCode: true } },
    },
  });
  return rows.map(mapLocation);
}

export async function getGeoLocation(ctx: AuthorizationContext, id: string) {
  assertPermission(ctx, PERMISSIONS.BRANCH_READ);
  const row = await prisma.franchiseLocation.findUnique({
    where: { id },
    include: {
      brand: { select: { id: true, name: true } },
      franchisee: { select: { id: true, legalName: true, tradingName: true } },
      assignedTerritory: { select: { id: true, name: true, territoryCode: true } },
      agreements: { take: 10, orderBy: { createdAt: "desc" }, select: { id: true, agreementNo: true, status: true } },
      documents: { take: 10, orderBy: { createdAt: "desc" }, select: { id: true, name: true, type: true, createdAt: true } },
    },
  });
  if (!row) throw new NotFoundError("Location not found");
  assertOrganizationAccess(ctx, row.organizationId);
  return mapLocation(row);
}

export async function createGeoLocation(ctx: AuthorizationContext, input: unknown) {
  assertPermission(ctx, PERMISSIONS.BRANCH_WRITE);
  const data = locationCreateSchema.parse(input);
  const posIssues = validatePosition([data.longitude, data.latitude], "coordinates");
  if (posIssues.some((i) => i.level === "error")) throw new ValidationError(posIssues.map((i) => i.message).join("; "));
  const statusMap: Record<string, any> = { ACTIVE: "ACTIVE", PLANNED: "PLANNING", INACTIVE: "TEMPORARILY_CLOSED", CLOSED: "CLOSED" };
  const brandId = data.brandId ?? (await prisma.franchiseBrand.findFirst({ where: { organizationId: ctx.organizationId }, select: { id: true } }))?.id;
  if (!brandId) throw new ValidationError("brandId is required (no brand found in organization)");

  const row = await prisma.$transaction(async (tx) => {
    const created = await tx.franchiseLocation.create({
      data: {
        organizationId: ctx.organizationId,
        name: data.name,
        code: data.outletCode,
        locationType: data.locationType as any,
        ownershipType: data.ownershipType,
        businessStatus: data.businessStatus,
        status: statusMap[data.businessStatus] ?? "PLANNING",
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        district: data.district,
        postalCode: data.postcode,
        country: data.country,
        latitude: data.latitude,
        longitude: data.longitude,
        brandId,
        franchiseeId: data.franchiseeId,
        contactInfo: (data.contactInfo ?? null) as any,
        operatingHours: (data.operatingHours ?? null) as any,
        openedAt: data.openingDate ? new Date(data.openingDate) : null,
        closedAt: data.closingDate ? new Date(data.closingDate) : null,
        assignedTerritoryId: data.assignedTerritoryId,
        assignedFranchiseeId: data.assignedFranchiseeId,
        storeSize: data.storeSize as any,
        parkingAvailability: data.parkingAvailability,
        propertyType: data.propertyType,
        rentalInformation: (data.rentalInformation ?? null) as any,
        supportingDocuments: (data.supportingDocuments ?? null) as any,
        photos: (data.photos ?? null) as any,
        geoMetadata: (data.geoMetadata ?? null) as any,
        geoSource: "MANUAL",
        createdById: ctx.userId || null,
        updatedById: ctx.userId || null,
      },
    });
    await tx.$executeRaw`UPDATE "FranchiseLocation" SET "geoPoint" = ST_SetSRID(ST_MakePoint(${data.longitude}, ${data.latitude}), 4326) WHERE "id" = ${created.id}`.catch(() => {});
    await writeGeoAuditLog({ organizationId: ctx.organizationId, entityType: "location", entityId: created.id, action: "CREATE", actorId: ctx.userId, after: created }, tx);
    return created;
  });
  return mapLocation(row);
}

export async function updateGeoLocation(ctx: AuthorizationContext, id: string, input: unknown) {
  assertPermission(ctx, PERMISSIONS.BRANCH_WRITE);
  const data = locationUpdateSchema.parse(input);
  const existing = await prisma.franchiseLocation.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Location not found");
  assertOrganizationAccess(ctx, existing.organizationId);
  if (data.latitude !== undefined || data.longitude !== undefined) {
    const lat = data.latitude ?? (existing.latitude ? Number(existing.latitude) : undefined);
    const lng = data.longitude ?? (existing.longitude ? Number(existing.longitude) : undefined);
    if (lat !== undefined && lng !== undefined) {
      const issues = validatePosition([lng, lat], "coordinates");
      if (issues.some((i) => i.level === "error")) throw new ValidationError(issues.map((i) => i.message).join("; "));
    }
  }
  const statusMap: Record<string, any> = { ACTIVE: "ACTIVE", PLANNED: "PLANNING", INACTIVE: "TEMPORARILY_CLOSED", CLOSED: "CLOSED" };
  const row = await prisma.$transaction(async (tx) => {
    const updated = await tx.franchiseLocation.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.outletCode !== undefined ? { code: data.outletCode } : {}),
        ...(data.locationType !== undefined ? { locationType: data.locationType as any } : {}),
        ...(data.ownershipType !== undefined ? { ownershipType: data.ownershipType } : {}),
        ...(data.businessStatus !== undefined ? { businessStatus: data.businessStatus, status: statusMap[data.businessStatus] ?? existing.status } : {}),
        ...(data.addressLine1 !== undefined ? { addressLine1: data.addressLine1 } : {}),
        ...(data.addressLine2 !== undefined ? { addressLine2: data.addressLine2 } : {}),
        ...(data.city !== undefined ? { city: data.city } : {}),
        ...(data.state !== undefined ? { state: data.state } : {}),
        ...(data.district !== undefined ? { district: data.district } : {}),
        ...(data.postcode !== undefined ? { postalCode: data.postcode } : {}),
        ...(data.country !== undefined ? { country: data.country } : {}),
        ...(data.latitude !== undefined ? { latitude: data.latitude } : {}),
        ...(data.longitude !== undefined ? { longitude: data.longitude } : {}),
        ...(data.brandId !== undefined ? { brandId: data.brandId ?? existing.brandId } : {}),
        ...(data.franchiseeId !== undefined ? { franchiseeId: data.franchiseeId } : {}),
        ...(data.contactInfo !== undefined ? { contactInfo: data.contactInfo as any } : {}),
        ...(data.operatingHours !== undefined ? { operatingHours: data.operatingHours as any } : {}),
        ...(data.openingDate !== undefined ? { openedAt: data.openingDate ? new Date(data.openingDate) : null } : {}),
        ...(data.closingDate !== undefined ? { closedAt: data.closingDate ? new Date(data.closingDate) : null } : {}),
        ...(data.assignedTerritoryId !== undefined ? { assignedTerritoryId: data.assignedTerritoryId } : {}),
        ...(data.assignedFranchiseeId !== undefined ? { assignedFranchiseeId: data.assignedFranchiseeId } : {}),
        ...(data.storeSize !== undefined ? { storeSize: data.storeSize as any } : {}),
        ...(data.parkingAvailability !== undefined ? { parkingAvailability: data.parkingAvailability } : {}),
        ...(data.propertyType !== undefined ? { propertyType: data.propertyType } : {}),
        ...(data.rentalInformation !== undefined ? { rentalInformation: data.rentalInformation as any } : {}),
        ...(data.supportingDocuments !== undefined ? { supportingDocuments: data.supportingDocuments as any } : {}),
        ...(data.photos !== undefined ? { photos: data.photos as any } : {}),
        ...(data.geoMetadata !== undefined ? { geoMetadata: data.geoMetadata as any } : {}),
        updatedById: ctx.userId || null,
        geoVersion: { increment: 1 },
      },
    });
    const lat = updated.latitude !== null ? Number(updated.latitude) : null;
    const lng = updated.longitude !== null ? Number(updated.longitude) : null;
    if (lat !== null && lng !== null) {
      await tx.$executeRaw`UPDATE "FranchiseLocation" SET "geoPoint" = ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326) WHERE "id" = ${updated.id}`.catch(() => {});
    }
    await writeGeoAuditLog({ organizationId: ctx.organizationId, entityType: "location", entityId: id, action: "UPDATE", actorId: ctx.userId, before: existing, after: updated }, tx);
    return updated;
  });
  return mapLocation(row);
}

export async function deleteGeoLocation(ctx: AuthorizationContext, id: string) {
  assertPermission(ctx, PERMISSIONS.BRANCH_WRITE);
  const existing = await prisma.franchiseLocation.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Location not found");
  assertOrganizationAccess(ctx, existing.organizationId);
  await prisma.$transaction(async (tx) => {
    await tx.franchiseLocation.delete({ where: { id } });
    await writeGeoAuditLog({ organizationId: ctx.organizationId, entityType: "location", entityId: id, action: "DELETE", actorId: ctx.userId, before: existing }, tx);
  });
  return { deleted: true, id };
}
