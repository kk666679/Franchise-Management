import type { GeoValidationResult } from "@/app/dashboard/location/_lib/types";
import {
  validatePosition as validateGeoPosition,
  validateGeometry,
  validateFeature,
  validateFeatureCollection,
} from "@/app/dashboard/location/_lib/validation";

export function validatePositionTuple(coordinates: [number, number]) {
  return validateGeoPosition(coordinates, "coordinates");
}

export { validateGeometry, validateFeature, validateFeatureCollection };
export type { GeoValidationResult };
