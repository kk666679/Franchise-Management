import type { Feature, FeatureCollection, Geometry, Position } from "geojson";
import { area, distance, point } from "@turf/turf";

export type AppGeoJSON = FeatureCollection;

export function createFeatureCollection(features: Feature[]): FeatureCollection {
  return {
    type: "FeatureCollection",
    features,
  };
}

export function validatePosition(coordinates: Position): boolean {
  const [longitude, latitude] = coordinates;

  return (
    Number.isFinite(longitude) &&
    Number.isFinite(latitude) &&
    longitude >= -180 &&
    longitude <= 180 &&
    latitude >= -90 &&
    latitude <= 90
  );
}

export function calculateArea(geometry: Geometry): number {
  return area({
    type: "Feature",
    properties: {},
    geometry,
  });
}

export function calculateDistance(
  from: [number, number],
  to: [number, number],
): number {
  return distance(point(from), point(to), { units: "kilometers" });
}
