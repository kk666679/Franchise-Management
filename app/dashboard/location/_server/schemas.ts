import { z } from "zod";
import { LOCATION_TYPES, LOCATION_STATUSES } from "@/app/dashboard/location/_lib/constants";

export const geoPointSchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([z.number().gte(-180).lte(180), z.number().gte(-90).lte(90)]),
});

export const locationCreateSchema = z.object({
  name: z.string().min(1).max(200),
  outletCode: z.string().min(1).max(64),
  locationType: z.enum(LOCATION_TYPES).default("FRANCHISE_OUTLET"),
  ownershipType: z.string().max(100).optional().nullable(),
  businessStatus: z.enum(LOCATION_STATUSES).default("ACTIVE"),
  addressLine1: z.string().min(1).max(255),
  addressLine2: z.string().max(255).optional().nullable(),
  country: z.string().min(1).max(100),
  state: z.string().max(100).optional().nullable(),
  district: z.string().max(100).optional().nullable(),
  city: z.string().min(1).max(100),
  postcode: z.string().min(1).max(30),
  latitude: z.number().gte(-90).lte(90),
  longitude: z.number().gte(-180).lte(180),
  brandId: z.string().min(1).optional().nullable(),
  franchiseeId: z.string().min(1).optional().nullable(),
  parentFranchiseId: z.string().min(1).optional().nullable(),
  franchiseId: z.string().min(1).optional().nullable(),
  contactInfo: z.record(z.string(), z.unknown()).optional().nullable(),
  operatingHours: z.record(z.string(), z.unknown()).optional().nullable(),
  openingDate: z.string().datetime().optional().nullable(),
  closingDate: z.string().datetime().optional().nullable(),
  assignedTerritoryId: z.string().min(1).optional().nullable(),
  assignedFranchiseeId: z.string().min(1).optional().nullable(),
  storeSize: z.number().nonnegative().optional().nullable(),
  parkingAvailability: z.boolean().optional().nullable(),
  propertyType: z.string().max(100).optional().nullable(),
  rentalInformation: z.record(z.string(), z.unknown()).optional().nullable(),
  supportingDocuments: z.array(z.unknown()).optional().nullable(),
  photos: z.array(z.string()).optional().nullable(),
  geoMetadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export const locationUpdateSchema = locationCreateSchema.partial();

export const territoryCreateSchema = z.object({
  name: z.string().min(1).max(200),
  territoryCode: z.string().min(1).max(64),
  parentTerritoryId: z.string().min(1).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
  district: z.string().max(100).optional().nullable(),
  territoryOwner: z.string().max(200).optional().nullable(),
  assignedMasterFranchiseId: z.string().optional().nullable(),
  assignedRegionalManagerId: z.string().optional().nullable(),
  territoryType: z.enum(["EXCLUSIVE", "NON_EXCLUSIVE", "RESTRICTED_DEVELOPMENT", "PROTECTED", "EXPANSION_OPPORTUNITY"]).default("NON_EXCLUSIVE"),
  exclusivityStatus: z.enum(["EXCLUSIVE", "NON_EXCLUSIVE"]).default("NON_EXCLUSIVE"),
  effectiveDate: z.string().datetime().optional().nullable(),
  expiryDate: z.string().datetime().optional().nullable(),
  status: z.enum(["DRAFT", "ACTIVE", "PENDING", "EXPIRED", "ARCHIVED"]).default("DRAFT"),
  geometry: z.any(), // validated by geo validation service
  brandId: z.string().optional().nullable(),
  populationEstimate: z.number().int().nonnegative().optional().nullable(),
  existingOutletCount: z.number().int().nonnegative().optional().nullable(),
  plannedOutletCount: z.number().int().nonnegative().optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
  allowedOverlapSqM: z.number().nonnegative().optional().nullable(),
  approvedOverlapIds: z.array(z.string()).optional().nullable(),
});

export const territoryUpdateSchema = territoryCreateSchema.partial();
