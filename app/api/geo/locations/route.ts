import { requireGeoContext } from "@lib/server/geo/auth";
import { jsonError, jsonOk } from "@lib/server/api-response";
import { listGeoLocations, createGeoLocation } from "@lib/server/geo/locations";

export async function GET(req: Request) {
  try {
    const ctx = await requireGeoContext();
    const url = new URL(req.url);
    const data = await listGeoLocations(ctx, {
      search: url.searchParams.get("search") ?? undefined,
      locationType: url.searchParams.get("locationType") ?? undefined,
      businessStatus: url.searchParams.get("businessStatus") ?? undefined,
      brandId: url.searchParams.get("brandId") ?? undefined,
      franchiseeId: url.searchParams.get("franchiseeId") ?? undefined,
      assignedTerritoryId: url.searchParams.get("assignedTerritoryId") ?? undefined,
      limit: url.searchParams.get("limit") ? Number(url.searchParams.get("limit")) : undefined,
    });
    return jsonOk({ data, count: data.length });
  } catch (e) { return jsonError(e); }
}

export async function POST(req: Request) {
  try {
    const ctx = await requireGeoContext();
    const body = await req.json();
    const data = await createGeoLocation(ctx, body);
    return jsonOk({ data }, 201);
  } catch (e) { return jsonError(e); }
}
