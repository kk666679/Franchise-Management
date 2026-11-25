import { NextResponse } from "next/server";
import { requireGeoContext } from "@lib/server/geo/auth";
import { jsonError, jsonOk } from "@lib/server/api-response";
import { listGeoLocations } from "@lib/server/geo/locations";

export async function POST(req: Request) {
  try {
    const ctx = await requireGeoContext();
    const body = await req.json().catch(() => ({}));
    const limit = Math.min(Number(body.limit ?? 5000), 10000);
    const locations = await listGeoLocations(ctx, { limit });
    const points = locations
      .filter((l) => l.latitude != null && l.longitude != null)
      .map((l) => ({ id: l.id, coordinates: [Number(l.longitude), Number(l.latitude)], weight: 1, locationType: l.locationType, status: l.businessStatus ?? l.status }));
    return jsonOk({ data: { type: "FeatureCollection", features: points.map((p) => ({ type: "Feature", properties: { id: p.id, weight: p.weight, locationType: p.locationType, status: p.status }, geometry: { type: "Point", coordinates: p.coordinates } })) } });
  } catch (e) { return jsonError(e); }
}
