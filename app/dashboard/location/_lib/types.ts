import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
  Position,
} from "geojson";
import type {
  FranchiseLocationType,
  GeoLocationStatus,
  TerritoryStatus,
  TerritoryType,
} from "./constants";

export type SupportedGeometry =
  | Point
  | MultiPoint
  | LineString
  | MultiLineString
  | Polygon
  | MultiPolygon;

export type GeoFeature<G extends Geometry = SupportedGeometry, P = GeoJsonProperties> = Feature<G, P>;
export type GeoFeatureCollection<G extends Geometry = SupportedGeometry, P = GeoJsonProperties> =
  FeatureCollection<G, P>;

export interface GeoAuditFields {
  createdAt: string;
  updatedAt: string;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export interface FranchiseLocationProperties extends GeoAuditFields {
  id: string;
  organizationId: string;
  franchiseId?: string | null;
  parentFranchiseId?: string | null;
  name: string;
  outletCode: string;
  locationType: FranchiseLocationType;
  ownershipType?: string | null;
  businessStatus: GeoLocationStatus;
  addressLine1: string;
  addressLine2?: string | null;
  country: string;
  state?: string | null;
  district?: string | null;
  city: string;
  postcode: string;
  latitude: number;
  longitude: number;
  contactInfo?: Record<string, unknown> | null;
  operatingHours?: Record<string, unknown> | null;
  openingDate?: string | null;
  closingDate?: string | null;
  assignedTerritoryId?: string | null;
  assignedFranchiseeId?: string | null;
  storeSize?: number | null;
  parkingAvailability?: boolean | null;
  propertyType?: string | null;
  rentalInformation?: Record<string, unknown> | null;
  supportingDocuments?: unknown[] | null;
  photos?: string[] | null;
  brandId?: string | null;
  brandName?: string | null;
  franchiseeName?: string | null;
  source?: string | null;
  version?: number | null;
  metadata?: Record<string, unknown> | null;
}

export type FranchiseLocationFeature = GeoFeature<Point, FranchiseLocationProperties>;
export type FranchiseLocationFeatureCollection = GeoFeatureCollection<Point, FranchiseLocationProperties>;

export interface TerritoryProperties extends GeoAuditFields {
  id: string;
  organizationId: string;
  name: string;
  territoryCode: string;
  parentTerritoryId?: string | null;
  country?: string | null;
  state?: string | null;
  district?: string | null;
  territoryOwner?: string | null;
  assignedMasterFranchiseId?: string | null;
  assignedRegionalManagerId?: string | null;
  territoryType: TerritoryType;
  exclusivityStatus: "EXCLUSIVE" | "NON_EXCLUSIVE";
  effectiveDate?: string | null;
  expiryDate?: string | null;
  status: TerritoryStatus;
  areaSqKm?: number | null;
  perimeterKm?: number | null;
  centroid?: Position | null;
  populationEstimate?: number | null;
  existingOutletCount?: number | null;
  plannedOutletCount?: number | null;
  brandId?: string | null;
  brandName?: string | null;
  source?: string | null;
  version?: number | null;
  metadata?: Record<string, unknown> | null;
  allowedOverlapSqM?: number | null;
  approvedOverlapIds?: string[] | null;
}

export type TerritoryFeature = GeoFeature<Polygon | MultiPolygon, TerritoryProperties>;
export type TerritoryFeatureCollection = GeoFeatureCollection<Polygon | MultiPolygon, TerritoryProperties>;

export interface GeoValidationIssue {
  level: "error" | "warning";
  code: string;
  message: string;
  path?: string;
  featureId?: string | number;
}

export interface GeoValidationResult {
  valid: boolean;
  issues: GeoValidationIssue[];
}

export interface GeoImportPreview {
  format: string;
  featureCount: number;
  geometryTypes: string[];
  valid: boolean;
  issues: GeoValidationIssue[];
  features: GeoFeatureCollection;
  warnings: string[];
}

export interface SpatialAnalysisSummary {
  generatedAt: string;
  organizationId: string;
  filters?: Record<string, unknown>;
}

export interface CoverageAnalysisResult extends SpatialAnalysisSummary {
  totalLocations: number;
  byState: Array<{ state: string; count: number }>;
  byDistrict: Array<{ district: string; count: number }>;
  byPostcode: Array<{ postcode: string; count: number }>;
  averageNearestDistanceKm: number | null;
  nearestDistances: Array<{ locationId: string; nearestLocationId: string | null; distanceKm: number | null }>;
  highConcentrationAreas: Array<{ label: string; count: number; centroid: Position }>;
  lowCoverageAreas: Array<{ label: string; count: number; centroid: Position }>;
  coveragePercentage: number | null;
  coverageDenominator?: string | null;
}

export interface CannibalizationResult extends SpatialAnalysisSummary {
  thresholdKm: number;
  alerts: Array<{
    severity: "LOW" | "MEDIUM" | "HIGH";
    locationAId: string;
    locationBId: string;
    distanceKm: number;
    message: string;
  }>;
  overlaps: Array<{ territoryAId: string; territoryBId: string; overlapAreaSqM: number }>;
}

export interface SiteSelectionInput {
  proposedPoint: Position;
  tradeAreaRadiusKm?: number;
  tradeAreaPolygon?: Polygon | MultiPolygon;
  brandId?: string | null;
}

export interface SiteSelectionResult extends SpatialAnalysisSummary {
  candidate: Position;
  score: number;
  scoreBreakdown: Array<{ factor: string; score: number; weight: number; reason: string }>;
  nearestOutlets: Array<{ locationId: string; name: string; distanceKm: number }>;
  territoryEligibility: Array<{ territoryId: string; name: string; eligible: boolean; reason: string }>;
  assumptions: string[];
  missingData: string[];
}

export interface GeoAuditEvent {
  id: string;
  organizationId: string;
  entityType: "location" | "territory" | "import" | "export" | "analysis" | "settings";
  entityId: string;
  action: string;
  actorId?: string | null;
  actorName?: string | null;
  before?: unknown;
  after?: unknown;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}
