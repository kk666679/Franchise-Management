import * as turf from "@turf/turf";
import type { Feature, FeatureCollection, Point, Polygon, MultiPolygon, Position } from "geojson";
import type { CoverageAnalysisResult, CannibalizationResult, SiteSelectionResult, SiteSelectionInput } from "./types";

export function bboxFilter(features: Feature[], bbox: [number, number, number, number]): Feature[] {
  const box = turf.bboxPolygon(bbox);
  return features.filter((f) => {
    if (!f.geometry) return false;
    try {
      if (f.geometry.type === "Point") return turf.booleanPointInPolygon(f as Feature<Point>, box);
      return turf.booleanIntersects(f as any, box);
    } catch {
      return false;
    }
  });
}

export function pointInPolygon(point: Position, polygon: Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon): boolean {
  const pt = turf.point(point);
  const poly = (polygon as any).type === "Feature" ? (polygon as Feature<Polygon | MultiPolygon>) : turf.feature(polygon as Polygon | MultiPolygon);
  return turf.booleanPointInPolygon(pt, poly);
}

export function distanceKm(a: Position, b: Position): number {
  return turf.distance(turf.point(a), turf.point(b), { units: "kilometers" });
}

export function polygonAreaSqKm(polygon: Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon): number {
  const poly = (polygon as any).type === "Feature" ? (polygon as Feature<Polygon | MultiPolygon>) : turf.feature(polygon as Polygon | MultiPolygon);
  return turf.area(poly) / 1_000_000;
}

export function polygonPerimeterKm(polygon: Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon): number {
  const poly = (polygon as any).type === "Feature" ? (polygon as Feature<Polygon | MultiPolygon>) : turf.feature(polygon as Polygon | MultiPolygon);
  const line = turf.polygonToLine(poly as any);
  return turf.length(line, { units: "kilometers" });
}

export function centroid(polygon: Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon): Position {
  const poly = (polygon as any).type === "Feature" ? (polygon as Feature<Polygon | MultiPolygon>) : turf.feature(polygon as Polygon | MultiPolygon);
  return turf.centroid(poly).geometry.coordinates;
}

export function simplifyPolygon<T extends Polygon | MultiPolygon>(geometry: T, tolerance = 0.0001): T {
  const simplified = turf.simplify(turf.feature(geometry) as any, { tolerance, highQuality: true, mutate: false });
  return simplified.geometry as T;
}

export function bufferPoint(point: Position, radiusKm: number): Feature<Polygon> {
  return turf.buffer(turf.point(point), radiusKm, { units: "kilometers" }) as Feature<Polygon>;
}

export function polygonsOverlap(a: Feature<Polygon | MultiPolygon>, b: Feature<Polygon | MultiPolygon>): boolean {
  try {
    if (!turf.booleanIntersects(a, b)) return false;
    const inter = turf.intersect(turf.featureCollection([a, b] as any));
    return !!inter && turf.area(inter) > 0;
  } catch {
    return false;
  }
}

export function intersectionAreaSqM(a: Feature<Polygon | MultiPolygon>, b: Feature<Polygon | MultiPolygon>): number {
  try {
    const inter = turf.intersect(turf.featureCollection([a, b] as any));
    if (!inter) return 0;
    return turf.area(inter);
  } catch {
    return 0;
  }
}

export function analyzeCoverage(
  organizationId: string,
  locations: Array<{ id: string; coordinates: Position; state?: string | null; district?: string | null; postcode?: string | null }>,
  territoryAreasSqKm?: number,
): CoverageAnalysisResult {
  const byStateMap = new Map<string, number>();
  const byDistrictMap = new Map<string, number>();
  const byPostcodeMap = new Map<string, number>();
  for (const loc of locations) {
    if (loc.state) byStateMap.set(loc.state, (byStateMap.get(loc.state) ?? 0) + 1);
    if (loc.district) byDistrictMap.set(loc.district, (byDistrictMap.get(loc.district) ?? 0) + 1);
    if (loc.postcode) byPostcodeMap.set(loc.postcode, (byPostcodeMap.get(loc.postcode) ?? 0) + 1);
  }

  const nearestDistances = locations.map((loc) => {
    let nearestId: string | null = null;
    let nearestDist: number | null = null;
    for (const other of locations) {
      if (other.id === loc.id) continue;
      const d = distanceKm(loc.coordinates, other.coordinates);
      if (nearestDist === null || d < nearestDist) { nearestDist = d; nearestId = other.id; }
    }
    return { locationId: loc.id, nearestLocationId: nearestId, distanceKm: nearestDist };
  });
  const validDistances = nearestDistances.map((n) => n.distanceKm).filter((d): d is number => d !== null);
  const averageNearestDistanceKm = validDistances.length ? validDistances.reduce((a, b) => a + b, 0) / validDistances.length : null;

  // Simple concentration buckets by state/district count
  const stateEntries = Array.from(byStateMap.entries()).map(([state, count]) => ({ state, count }));
  const districtEntries = Array.from(byDistrictMap.entries()).map(([district, count]) => ({ district, count }));
  const highConcentrationAreas = districtEntries
    .filter((d) => d.count >= Math.max(3, Math.ceil(locations.length * 0.2)))
    .map((d) => ({ label: d.district, count: d.count, centroid: [0, 0] as Position }));
  const lowCoverageAreas = stateEntries
    .filter((s) => s.count <= 1)
    .map((s) => ({ label: s.state, count: s.count, centroid: [0, 0] as Position }));

  let coveragePercentage: number | null = null;
  let coverageDenominator: string | null = null;
  if (territoryAreasSqKm && territoryAreasSqKm > 0) {
    // rough proxy: assume 5km radius service area per location, capped at territory area
    const serviceArea = Math.min(locations.length * Math.PI * 25, territoryAreasSqKm);
    coveragePercentage = Math.min(100, (serviceArea / territoryAreasSqKm) * 100);
    coverageDenominator = "territory area (5km radius proxy per outlet)";
  }

  return {
    generatedAt: new Date().toISOString(),
    organizationId,
    totalLocations: locations.length,
    byState: stateEntries.sort((a, b) => b.count - a.count),
    byDistrict: districtEntries.sort((a, b) => b.count - a.count),
    byPostcode: Array.from(byPostcodeMap.entries()).map(([postcode, count]) => ({ postcode, count })).sort((a, b) => b.count - a.count),
    averageNearestDistanceKm,
    nearestDistances,
    highConcentrationAreas,
    lowCoverageAreas,
    coveragePercentage,
    coverageDenominator,
  };
}

export function analyzeCannibalization(
  organizationId: string,
  locations: Array<{ id: string; coordinates: Position; name?: string }>,
  thresholdKm: number,
  territories: Array<{ id: string; feature: Feature<Polygon | MultiPolygon> }> = [],
): CannibalizationResult {
  const alerts: CannibalizationResult["alerts"] = [];
  for (let i = 0; i < locations.length; i++) {
    for (let j = i + 1; j < locations.length; j++) {
      const d = distanceKm(locations[i].coordinates, locations[j].coordinates);
      if (d <= thresholdKm) {
        const severity = d <= thresholdKm * 0.3 ? "HIGH" : d <= thresholdKm * 0.6 ? "MEDIUM" : "LOW";
        alerts.push({
          severity,
          locationAId: locations[i].id,
          locationBId: locations[j].id,
          distanceKm: d,
          message: `Potential proximity risk: ${d.toFixed(2)} km apart (threshold ${thresholdKm} km). This is a distance-based indicator, not proof of commercial cannibalization.`,
        });
      }
    }
  }
  alerts.sort((a, b) => a.distanceKm - b.distanceKm);
  const overlaps: CannibalizationResult["overlaps"] = [];
  for (let i = 0; i < territories.length; i++) {
    for (let j = i + 1; j < territories.length; j++) {
      const area = intersectionAreaSqM(territories[i].feature, territories[j].feature);
      if (area > 0) overlaps.push({ territoryAId: territories[i].id, territoryBId: territories[j].id, overlapAreaSqM: area });
    }
  }
  return { generatedAt: new Date().toISOString(), organizationId, thresholdKm, alerts, overlaps };
}

export function scoreSiteSelection(
  organizationId: string,
  input: SiteSelectionInput,
  locations: Array<{ id: string; name: string; coordinates: Position }>,
  territories: Array<{ id: string; name: string; feature: Feature<Polygon | MultiPolygon>; status?: string; type?: string }>,
): SiteSelectionResult {
  const assumptions: string[] = [];
  const missingData: string[] = [
    "Population data not provided",
    "Road network/accessibility data not provided",
    "Competitor dataset not provided",
    "Commercial area proximity not provided",
  ];
  assumptions.push("Scoring uses available location and territory data only.");
  assumptions.push("Distance factor rewards separation from nearest existing outlet up to 10km.");

  const nearestOutlets = locations
    .map((l) => ({ locationId: l.id, name: l.name, distanceKm: distanceKm(input.proposedPoint, l.coordinates) }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 5);

  const nearestKm = nearestOutlets[0]?.distanceKm ?? null;
  const distanceScore = nearestKm === null ? 50 : Math.max(0, Math.min(100, (nearestKm / 10) * 100));
  if (nearestKm !== null && nearestKm < 1) assumptions.push("Nearest outlet is under 1km; proximity risk is high.");

  const territoryEligibility = territories.map((t) => {
    const inside = pointInPolygon(input.proposedPoint, t.feature);
    if (!inside) return { territoryId: t.id, name: t.name, eligible: false, reason: "Proposed point is outside territory." };
    if (t.status && !["ACTIVE", "DRAFT", "PENDING"].includes(t.status)) {
      return { territoryId: t.id, name: t.name, eligible: false, reason: `Territory status is ${t.status}.` };
    }
    return { territoryId: t.id, name: t.name, eligible: true, reason: "Point falls within territory boundary." };
  });
  const eligibleCount = territoryEligibility.filter((t) => t.eligible).length;
  const territoryScore = territories.length === 0 ? 50 : eligibleCount > 0 ? 100 : 10;
  if (territories.length === 0) missingData.push("No territories configured for eligibility check");

  const nearbyCount = locations.filter((l) => distanceKm(input.proposedPoint, l.coordinates) <= 5).length;
  const densityScore = Math.max(0, 100 - nearbyCount * 20);

  const coverageScore = nearestKm === null ? 50 : Math.max(0, Math.min(100, nearestKm * 12));

  const breakdown = [
    { factor: "Distance from existing outlets", score: distanceScore, weight: 0.35, reason: nearestKm === null ? "No existing outlets; neutral score." : `Nearest outlet is ${nearestKm.toFixed(2)} km away.` },
    { factor: "Territory eligibility", score: territoryScore, weight: 0.25, reason: eligibleCount > 0 ? `Eligible in ${eligibleCount} territory(ies).` : "No eligible territory found at proposed point." },
    { factor: "Outlet density (5km)", score: densityScore, weight: 0.2, reason: `${nearbyCount} existing outlet(s) within 5km.` },
    { factor: "Coverage gap proxy", score: coverageScore, weight: 0.2, reason: nearestKm === null ? "No coverage baseline." : "Based on distance to nearest outlet; no population/road data." },
  ];
  const score = breakdown.reduce((s, b) => s + b.score * b.weight, 0);

  return {
    generatedAt: new Date().toISOString(),
    organizationId,
    candidate: input.proposedPoint,
    score: Math.round(score * 10) / 10,
    scoreBreakdown: breakdown,
    nearestOutlets,
    territoryEligibility,
    assumptions,
    missingData,
  };
}
