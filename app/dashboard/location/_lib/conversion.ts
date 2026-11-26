import { kml as kmlToGeoJSON, gpx as gpxToGeoJSON } from "@tmcw/togeojson";
import osmtogeojson from "osmtogeojson";
import { geojsonToWKT, wktToGeoJSON } from "@terraformer/wkt";
import type { FeatureCollection } from "geojson";
import { normalizeToFeatureCollection, validateFeatureCollection } from "./validation";
import type { GeoFeatureCollection, GeoImportPreview, GeoValidationIssue } from "./types";

export type GeoImportFormat = "geojson" | "json" | "kml" | "gpx" | "wkt" | "csv" | "osm" | "unknown";

function ext(name: string): string {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
}

export function detectFormat(fileName: string, contentType?: string | null, content?: string): GeoImportFormat {
  const e = ext(fileName);
  if (e === "geojson" || e === "json") {
    // try to distinguish plain JSON from GeoJSON by content
    if (content) {
      try {
        const parsed = JSON.parse(content);
        if (parsed?.type === "FeatureCollection" || parsed?.type === "Feature" || parsed?.type === "Point" || parsed?.type === "Polygon" || parsed?.type === "MultiPolygon" || parsed?.type === "LineString") {
          return "geojson";
        }
      } catch { /* ignore */ }
    }
    return e === "geojson" ? "geojson" : "json";
  }
  if (e === "kml") return "kml";
  if (e === "gpx") return "gpx";
  if (e === "wkt") return "wkt";
  if (e === "csv") return "csv";
  if (e === "osm" || e === "xml") return "osm";
  if (contentType?.includes("kml")) return "kml";
  if (contentType?.includes("gpx")) return "gpx";
  if (contentType?.includes("geo+json")) return "geojson";
  return "unknown";
}

function parseXml(text: string): Document {
  const DOMParserImpl = (globalThis as any).DOMParser;
  if (DOMParserImpl) {
    const doc = new DOMParserImpl().parseFromString(text, "text/xml");
    const err = doc.getElementsByTagName?.("parsererror");
    if (err?.length) throw new Error("Invalid XML document");
    return doc;
  }

  const { DOMParser } = require("@xmldom/xmldom");
  return new DOMParser().parseFromString(text, "text/xml");
}

export function parseCsvToGeoJSON(csv: string): GeoFeatureCollection {
  const lines = csv.replace(/\r\n/g, "\n").split("\n").filter((l) => l.trim().length > 0);
  if (lines.length < 2) throw new Error("CSV must include header and at least one data row");
  const header = splitCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
  const latIdx = header.findIndex((h) => ["lat", "latitude", "y"].includes(h));
  const lngIdx = header.findIndex((h) => ["lng", "lon", "longitude", "x"].includes(h));
  if (latIdx < 0 || lngIdx < 0) throw new Error("CSV must contain latitude/lat/y and longitude/lng/lon/x columns");
  const features = lines.slice(1).map((line, rowIdx) => {
    const cols = splitCsvLine(line);
    const lat = Number(cols[latIdx]);
    const lng = Number(cols[lngIdx]);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      throw new Error(`Invalid coordinates at CSV row ${rowIdx + 2}`);
    }
    const properties: Record<string, unknown> = {};
    header.forEach((h, i) => {
      if (i === latIdx || i === lngIdx) return;
      const raw = cols[i] ?? "";
      properties[h] = raw === "" ? null : coerceScalar(raw);
    });
    return {
      type: "Feature" as const,
      id: properties.id as string | number | undefined,
      properties,
      geometry: { type: "Point" as const, coordinates: [lng, lat] },
    };
  });
  return { type: "FeatureCollection", features } as GeoFeatureCollection;
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') inQ = false;
      else cur += ch;
    } else {
      if (ch === '"') inQ = true;
      else if (ch === ",") { out.push(cur); cur = ""; }
      else cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function coerceScalar(v: string): unknown {
  if (v === "true") return true;
  if (v === "false") return false;
  if (v === "null") return null;
  const n = Number(v);
  if (v.trim() !== "" && Number.isFinite(n)) return n;
  return v;
}

export async function convertToGeoJSON(
  content: string,
  format: GeoImportFormat,
): Promise<GeoFeatureCollection> {
  switch (format) {
    case "geojson":
    case "json": {
      const parsed = JSON.parse(content);
      return normalizeToFeatureCollection(parsed);
    }
    case "kml": {
      const doc = parseXml(content);
      return normalizeToFeatureCollection(kmlToGeoJSON(doc));
    }
    case "gpx": {
      const doc = parseXml(content);
      return normalizeToFeatureCollection(gpxToGeoJSON(doc));
    }
    case "wkt": {
      const trimmed = content.trim();
      // support multiple WKT lines or GeometryCollection
      const geometries = splitWktStatements(trimmed);
      const features = geometries.map((wkt, i) => ({
        type: "Feature" as const,
        id: `wkt-${i + 1}`,
        properties: {},
        geometry: wktToGeoJSON(wkt),
      }));
      return { type: "FeatureCollection", features } as GeoFeatureCollection;
    }
    case "csv":
      return parseCsvToGeoJSON(content);
    case "osm": {
      const parsed = JSON.parse(content);
      return normalizeToFeatureCollection(osmtogeojson(parsed));
    }
    default:
      throw new Error(`Unsupported import format: ${format}`);
  }
}

function splitWktStatements(input: string): string[] {
  // Simple split: WKT statements are usually one per line or separated by semicolons.
  // Handle common case of single geometry or multiple lines.
  const parts = input.split(/;\s*\n|\n(?=[A-Z])/g).map((s) => s.trim().replace(/;$/, "")).filter(Boolean);
  return parts.length ? parts : [input];
}

export function exportFeatureCollection(
  fc: FeatureCollection,
  format: "geojson" | "json" | "wkt" | "csv",
): { content: string; contentType: string; extension: string } {
  if (format === "geojson" || format === "json") {
    return { content: JSON.stringify(fc, null, 2), contentType: "application/geo+json", extension: "geojson" };
  }
  if (format === "wkt") {
    const lines = fc.features.map((f, i) => {
      if (!f.geometry) return null;
      const wkt = geojsonToWKT(f.geometry as any);
      const id = f.id ?? i + 1;
      return `${id}\t${wkt}`;
    }).filter((line): line is string => line !== null);
    return { content: lines.join("\n"), contentType: "text/plain", extension: "wkt" };
  }
  if (format === "csv") {
    const rows: string[] = [];
    const propKeys = Array.from(new Set(fc.features.flatMap((f) => Object.keys(f.properties ?? {}))));
    rows.push(["id", "longitude", "latitude", ...propKeys].join(","));
    for (const f of fc.features) {
      if (f.geometry?.type !== "Point") continue;
      const [lng, lat] = f.geometry.coordinates as [number, number];
      const props = propKeys.map((k) => csvCell((f.properties as Record<string, unknown> | null)?.[k]));
      rows.push([csvCell(f.id), csvCell(lng), csvCell(lat), ...props].join(","));
    }
    return { content: rows.join("\n"), contentType: "text/csv", extension: "csv" };
  }
  throw new Error(`Unsupported export format: ${format}`);
}

function csvCell(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function previewImport(
  fileName: string,
  content: string,
  contentType?: string | null,
): Promise<GeoImportPreview> {
  const format = detectFormat(fileName, contentType, content);
  const warnings: string[] = [];
  let features: GeoFeatureCollection;
  try {
    features = await convertToGeoJSON(content, format);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to parse file";
    return {
      format,
      featureCount: 0,
      geometryTypes: [],
      valid: false,
      issues: [{ level: "error", code: "PARSE_ERROR", message: msg }],
      features: { type: "FeatureCollection", features: [] },
      warnings,
    };
  }
  const validation = validateFeatureCollection(features);
  const geometryTypes = Array.from(new Set(features.features.map((f) => f.geometry?.type).filter(Boolean) as string[]));
  if (features.features.length === 0) warnings.push("No features found in file.");
  return {
    format,
    featureCount: features.features.length,
    geometryTypes,
    valid: validation.valid,
    issues: validation.issues,
    features,
    warnings,
  };
}
