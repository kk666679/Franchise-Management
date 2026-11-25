export const GEO_SRID = 4326;
export const GEO_CRS = "EPSG:4326" as const;

export const LOCATION_TYPES = [
  "HEADQUARTERS",
  "REGIONAL_OFFICE",
  "MASTER_FRANCHISE_OFFICE",
  "FRANCHISE_OUTLET",
  "COMPANY_OWNED_OUTLET",
  "SUB_FRANCHISE_OUTLET",
  "DISTRIBUTION_CENTRE",
  "WAREHOUSE",
  "SERVICE_CENTRE",
  "PLANNED_LOCATION",
  "CLOSED_LOCATION",
] as const;

export type FranchiseLocationType = (typeof LOCATION_TYPES)[number];

export const LOCATION_STATUSES = ["ACTIVE", "PLANNED", "INACTIVE", "CLOSED"] as const;
export type GeoLocationStatus = (typeof LOCATION_STATUSES)[number];

export const TERRITORY_TYPES = [
  "EXCLUSIVE",
  "NON_EXCLUSIVE",
  "RESTRICTED_DEVELOPMENT",
  "PROTECTED",
  "EXPANSION_OPPORTUNITY",
] as const;
export type TerritoryType = (typeof TERRITORY_TYPES)[number];

export const TERRITORY_STATUSES = ["DRAFT", "ACTIVE", "PENDING", "EXPIRED", "ARCHIVED"] as const;
export type TerritoryStatus = (typeof TERRITORY_STATUSES)[number];

export const LOCATION_TYPE_LABELS: Record<FranchiseLocationType, string> = {
  HEADQUARTERS: "Headquarters",
  REGIONAL_OFFICE: "Regional Office",
  MASTER_FRANCHISE_OFFICE: "Master Franchise Office",
  FRANCHISE_OUTLET: "Franchise Outlet",
  COMPANY_OWNED_OUTLET: "Company-Owned Outlet",
  SUB_FRANCHISE_OUTLET: "Sub-Franchise Outlet",
  DISTRIBUTION_CENTRE: "Distribution Centre",
  WAREHOUSE: "Warehouse",
  SERVICE_CENTRE: "Service Centre",
  PLANNED_LOCATION: "Planned Location",
  CLOSED_LOCATION: "Closed/Inactive Location",
};

export const LOCATION_TYPE_COLORS: Record<FranchiseLocationType, string> = {
  HEADQUARTERS: "#7c3aed",
  REGIONAL_OFFICE: "#2563eb",
  MASTER_FRANCHISE_OFFICE: "#0891b2",
  FRANCHISE_OUTLET: "#16a34a",
  COMPANY_OWNED_OUTLET: "#059669",
  SUB_FRANCHISE_OUTLET: "#65a30d",
  DISTRIBUTION_CENTRE: "#ea580c",
  WAREHOUSE: "#d97706",
  SERVICE_CENTRE: "#dc2626",
  PLANNED_LOCATION: "#6366f1",
  CLOSED_LOCATION: "#6b7280",
};

export const DEFAULT_CANNIBALIZATION_THRESHOLDS_KM = [1, 3, 5, 10] as const;
export const DEFAULT_OVERLAP_TOLERANCE_SQM = 100;
export const MAX_GEOJSON_IMPORT_BYTES = 10 * 1024 * 1024; // 10MB
export const MAX_GEOMETRY_VERTICES = 50000;
