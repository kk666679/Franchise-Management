import { prisma } from "@/lib/prisma";
import { assertPermission } from "@lib/server/auth";
import type { AuthorizationContext } from "@lib/server/auth";
import { PERMISSIONS } from "@/lib/rbac";
import { analyzeCoverage, analyzeCannibalization, scoreSiteSelection } from "@/app/dashboard/location/_lib/spatial";
import { listGeoLocations } from "./locations";
import { listGeoTerritories } from "./territories";
import { writeGeoAuditLog } from "./audit";
import type { SiteSelectionInput } from "@/app/dashboard/location/_lib/types";

export async function runCoverageAnalysis(ctx: AuthorizationContext) {
  assertPermission(ctx, PERMISSIONS.BRANCH_READ);
  const locations = await listGeoLocations(ctx, { limit: 2000 });
  const pts = locations.filter((l) => l.latitude != null && l.longitude != null).map((l) => ({
    id: l.id, coordinates: [Number(l.longitude), Number(l.latitude)] as [number, number],
    state: l.state, district: l.district, postcode: l.postalCode,
  }));
  const territories = await listGeoTerritories(ctx, { limit: 1000 });
  const territoryArea = territories.reduce((s, t) => s + (t.areaSqKm ?? 0), 0);
  const result = analyzeCoverage(ctx.organizationId, pts, territoryArea > 0 ? territoryArea : undefined);
  await prisma.geoAnalysisResult.create({ data: { organizationId: ctx.organizationId, analysisType: "COVERAGE", input: { locationCount: pts.length } as any, result: result as any, summary: { totalLocations: result.totalLocations } as any, createdById: ctx.userId || null } }).catch(() => {});
  await writeGeoAuditLog({ organizationId: ctx.organizationId, entityType: "analysis", entityId: "coverage", action: "COVERAGE_ANALYSIS", actorId: ctx.userId, metadata: { locationCount: pts.length } }).catch(() => {});
  return result;
}

export async function runCannibalizationAnalysis(ctx: AuthorizationContext, thresholdKm: number) {
  assertPermission(ctx, PERMISSIONS.BRANCH_READ);
  const locations = await listGeoLocations(ctx, { limit: 2000 });
  const pts = locations.filter((l) => l.latitude != null && l.longitude != null).map((l) => ({
    id: l.id, name: l.name, coordinates: [Number(l.longitude), Number(l.latitude)] as [number, number],
  }));
  const territories = await listGeoTerritories(ctx, { limit: 1000 });
  const terrFeatures = territories.filter((t) => t.geometry).map((t) => ({ id: t.id, feature: { type: "Feature" as const, properties: {}, geometry: t.geometry } as any }));
  const result = analyzeCannibalization(ctx.organizationId, pts, thresholdKm, terrFeatures);
  await prisma.geoAnalysisResult.create({ data: { organizationId: ctx.organizationId, analysisType: "CANNIBALIZATION", input: { thresholdKm } as any, result: result as any, summary: { alertCount: result.alerts.length } as any, createdById: ctx.userId || null } }).catch(() => {});
  return result;
}

export async function runSiteSelection(ctx: AuthorizationContext, input: SiteSelectionInput) {
  assertPermission(ctx, PERMISSIONS.BRANCH_READ);
  const locations = await listGeoLocations(ctx, { limit: 2000 });
  const pts = locations.filter((l) => l.latitude != null && l.longitude != null).map((l) => ({
    id: l.id, name: l.name, coordinates: [Number(l.longitude), Number(l.latitude)] as [number, number],
  }));
  const territories = await listGeoTerritories(ctx, { limit: 1000 });
  const terrFeatures = territories.filter((t) => t.geometry).map((t) => ({ id: t.id, name: t.name, status: t.status, type: t.territoryType, feature: { type: "Feature" as const, properties: {}, geometry: t.geometry } as any }));
  const result = scoreSiteSelection(ctx.organizationId, input, pts, terrFeatures);
  await prisma.geoAnalysisResult.create({ data: { organizationId: ctx.organizationId, analysisType: "SITE_SELECTION", input: input as any, result: result as any, summary: { score: result.score } as any, createdById: ctx.userId || null } }).catch(() => {});
  return result;
}
