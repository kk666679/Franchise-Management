/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />

declare module "@terraformer/wkt" {
  export function geojsonToWKT(geometry: unknown): string;
  export function wktToGeoJSON(wkt: string): unknown;
}
