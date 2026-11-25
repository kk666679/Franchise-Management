import { requireGeoContext } from "@lib/server/geo/auth";
import { jsonError, jsonOk } from "@lib/server/api-response";
import { exportFeatureCollection } from "@/lib/geo/conversion";
import { listGeoLocations } from "@lib/server/geo/locations";
import { listGeoTerritories } from "@lib/server/geo/territories";
import type { FeatureCollection } from "geojson";

export async function GET(req: Request) {
  try {
    const ctx = await requireGeoContext();
    const url = new URL(req.url);
    const format = (url.searchParams.get("format") ?? "geojson") as "geojson" | "json" | "wkt" | "csv";
    const entity = url.searchParams.get("entity") ?? "locations"; // locations | territories | all
    const features: any[] = [];

    if (entity === "locations" || entity === "all") {
      const locs = await listGeoLocations(ctx, { limit: 5000 });
      for (const l of locs) {
        if (l.longitude == null || l.latitude == null) continue;
        features.push({
          type: "Feature",
          id: l.id,
          properties: {
            entity: "location",
            name: l.name,
            code: l.code,
            locationType: l.locationType,
            status: l.status,
            businessStatus: l.businessStatus,
            brandId: l.brandId,
            franchiseeId: l.franchiseeId,
            city: l.city, state: l.state, district: l.district, postcode: l.postalCode, country: l.country,
          },
          geometry: { type: "Point", coordinates: [Number(l.longitude), Number(l.latitude)] },
        });
      }
    }
    if (entity === "territories" || entity === "all") {
      const terrs = await listGeoTerritories(ctx, { limit: 2000 });
      for (const t of terrs) {
        if (!t.geometry) continue;
        features.push({
          type: "Feature",
          id: t.id,
          properties: { entity: "territory", name: t.name, territoryCode: t.territoryCode, territoryType: t.territoryType, status: t.status, brandId: t.brandId },
          geometry: t.geometry,
        });
      }
    }

    const fc: FeatureCollection = { type: "FeatureCollection", features };
    const out = exportFeatureCollection(fc, format === "json" ? "geojson" : format);
    return new Response(out.content, {
      status: 200,
      headers: {
        "Content-Type": out.contentType,
        "Content-Disposition": `attachment; filename="geo-export-${entity}.${out.extension}"`,
      },
    });
  } catch (e) { return jsonError(e); }
}
