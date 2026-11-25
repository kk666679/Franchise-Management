import {
  GEO_CRS,
  MAX_GEOMETRY_VERTICES,
  type FranchiseLocationType,
} from "./constants";
import type {
  GeoFeature,
  GeoFeatureCollection,
  GeoValidationIssue,
  GeoValidationResult,
  SupportedGeometry,
} from "./types";
import type { Feature, FeatureCollection, Geometry, Position } from "geojson";

const SUPPORTED_GEOMETRY_TYPES = new Set<SupportedGeometry["type"]>([
  "Point",
  "MultiPoint",
  "LineString",
  "MultiLineString",
  "Polygon",
  "MultiPolygon",
]);

function issue(
  level: GeoValidationIssue["level"],
  code: string,
  message: string,
  path?: string,
  featureId?: string | number,
): GeoValidationIssue {
  return { level, code, message, path, featureId };
}

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

export function isSupportedGeometryType(type: string): type is SupportedGeometry["type"] {
  return SUPPORTED_GEOMETRY_TYPES.has(type as SupportedGeometry["type"]);
}

export function countVertices(geometry: Geometry | null | undefined): number {
  if (!geometry) return 0;
  const walk = (coords: unknown): number => {
    if (!Array.isArray(coords)) return 0;
    if (coords.length >= 2 && coords.every((c) => typeof c === "number")) return 1;
    return coords.reduce((sum, c) => sum + walk(c), 0);
  };
  return walk((geometry as any).coordinates);
}

export function validatePosition(pos: unknown, path: string, featureId?: string | number): GeoValidationIssue[] {
  const issues: GeoValidationIssue[] = [];
  if (!Array.isArray(pos) || pos.length < 2) {
    issues.push(issue("error", "INVALID_POSITION", "Position must be an array [lng, lat, ...]", path, featureId));
    return issues;
  }
  const [lng, lat] = pos;
  if (!isFiniteNumber(lng) || !isFiniteNumber(lat)) {
    issues.push(issue("error", "INVALID_COORDINATE", "Longitude/latitude must be finite numbers", path, featureId));
    return issues;
  }
  if (lng < -180 || lng > 180) {
    issues.push(issue("error", "LNG_OUT_OF_RANGE", `Longitude ${lng} outside [-180,180]`, path, featureId));
  }
  if (lat < -90 || lat > 90) {
    issues.push(issue("error", "LAT_OUT_OF_RANGE", `Latitude ${lat} outside [-90,90]`, path, featureId));
  }
  return issues;
}

function validateCoordinates(coords: unknown, path: string, featureId?: string | number): GeoValidationIssue[] {
  if (!Array.isArray(coords)) {
    return [issue("error", "INVALID_COORDINATES", "Coordinates must be an array", path, featureId)];
  }
  // Position
  if (coords.length >= 2 && coords.every((c) => typeof c === "number")) {
    return validatePosition(coords, path, featureId);
  }
  return coords.flatMap((c, i) => validateCoordinates(c, `${path}[${i}]`, featureId));
}

export function validateGeometry(
  geometry: Geometry | null | undefined,
  path = "geometry",
  featureId?: string | number,
): GeoValidationIssue[] {
  if (geometry === null) return [];
  if (!geometry || typeof geometry !== "object") {
    return [issue("error", "MISSING_GEOMETRY", "Geometry is required", path, featureId)];
  }
  if (!isSupportedGeometryType((geometry as any).type)) {
    return [issue("error", "UNSUPPORTED_GEOMETRY", `Unsupported geometry type ${(geometry as any).type}`, path, featureId)];
  }
  const g = geometry as SupportedGeometry;
  const issues = validateCoordinates((g as any).coordinates, `${path}.coordinates`, featureId);
  const vertices = countVertices(g);
  if (vertices > MAX_GEOMETRY_VERTICES) {
    issues.push(issue("error", "GEOMETRY_TOO_COMPLEX", `Geometry has ${vertices} vertices; max ${MAX_GEOMETRY_VERTICES}`, path, featureId));
  }
  if (g.type === "Polygon" || g.type === "MultiPolygon") {
    const polygons = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
    polygons.forEach((poly, pi) => {
      poly.forEach((ring, ri) => {
        if (ring.length < 4) {
          issues.push(issue("error", "INVALID_RING", "Polygon ring must have at least 4 positions", `${path}.coordinates[${pi}][${ri}]`, featureId));
        } else {
          const first = ring[0];
          const last = ring[ring.length - 1];
          if (first[0] !== last[0] || first[1] !== last[1]) {
            issues.push(issue("error", "RING_NOT_CLOSED", "Polygon ring must be closed", `${path}.coordinates[${pi}][${ri}]`, featureId));
          }
        }
      });
    });
  }
  return issues;
}

export function validateFeature(feature: unknown, path = "feature"): GeoValidationResult {
  const issues: GeoValidationIssue[] = [];
  if (!feature || typeof feature !== "object") {
    return { valid: false, issues: [issue("error", "INVALID_FEATURE", "Feature must be an object", path)] };
  }
  const f = feature as Feature;
  const featureId = (f as any).id;
  if (f.type !== "Feature") issues.push(issue("error", "INVALID_FEATURE_TYPE", "Feature.type must be 'Feature'", `${path}.type`, featureId));
  if (!("geometry" in f)) issues.push(issue("error", "MISSING_GEOMETRY", "Feature.geometry is required", `${path}.geometry`, featureId));
  else issues.push(...validateGeometry(f.geometry, `${path}.geometry`, featureId));
  if (f.properties !== null && (typeof f.properties !== "object" || Array.isArray(f.properties))) {
    issues.push(issue("error", "INVALID_PROPERTIES", "Feature.properties must be an object or null", `${path}.properties`, featureId));
  }
  return { valid: !issues.some((i) => i.level === "error"), issues };
}

export function validateFeatureCollection(fc: unknown, path = "featureCollection"): GeoValidationResult {
  const issues: GeoValidationIssue[] = [];
  if (!fc || typeof fc !== "object") {
    return { valid: false, issues: [issue("error", "INVALID_FEATURE_COLLECTION", "FeatureCollection must be an object", path)] };
  }
  const collection = fc as FeatureCollection;
  if (collection.type !== "FeatureCollection") {
    issues.push(issue("error", "INVALID_FC_TYPE", "FeatureCollection.type must be 'FeatureCollection'", `${path}.type`));
  }
  if (!Array.isArray(collection.features)) {
    issues.push(issue("error", "INVALID_FEATURES", "FeatureCollection.features must be an array", `${path}.features`));
  } else {
    collection.features.forEach((f, i) => {
      issues.push(...validateFeature(f, `${path}.features[${i}]`).issues);
    });
  }
  return { valid: !issues.some((i) => i.level === "error"), issues };
}

export function normalizeToFeatureCollection(input: unknown): GeoFeatureCollection {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid GeoJSON input");
  }
  const obj = input as any;
  if (obj.type === "FeatureCollection" && Array.isArray(obj.features)) {
    return obj as GeoFeatureCollection;
  }
  if (obj.type === "Feature") {
    return { type: "FeatureCollection", features: [obj] } as GeoFeatureCollection;
  }
  if (isSupportedGeometryType(obj.type)) {
    return {
      type: "FeatureCollection",
      features: [{ type: "Feature", properties: {}, geometry: obj }],
    } as GeoFeatureCollection;
  }
  throw new Error("Input must be a GeoJSON FeatureCollection, Feature, or supported Geometry");
}

export function assertWgs84(position: Position): void {
  const [lng, lat] = position;
  if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
    throw new Error(`Coordinates [${lng}, ${lat}] outside WGS84 ${GEO_CRS} bounds`);
  }
}

export function makePointFeature(
  coordinates: Position,
  properties: Record<string, unknown>,
  id?: string | number,
): GeoFeature {
  assertWgs84(coordinates);
  return {
    type: "Feature",
    ...(id !== undefined ? { id } : {}),
    properties,
    geometry: { type: "Point", coordinates },
  } as GeoFeature;
}
