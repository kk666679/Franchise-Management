import { requireGeoContext } from "@lib/server/geo/auth";
import { jsonError, jsonOk } from "@lib/server/api-response";
import { listGeoTerritories, createGeoTerritory } from "@lib/server/geo/territories";

export async function GET(req: Request) {
  try {
    const ctx = await requireGeoContext();
    const url = new URL(req.url);
    const data = await listGeoTerritories(ctx, {
      status: url.searchParams.get("status") ?? undefined,
      brandId: url.searchParams.get("brandId") ?? undefined,
      search: url.searchParams.get("search") ?? undefined,
      limit: url.searchParams.get("limit") ? Number(url.searchParams.get("limit")) : undefined,
    });
    return jsonOk({ data, count: data.length });
  } catch (e) { return jsonError(e); }
}

export async function POST(req: Request) {
  try {
    const ctx = await requireGeoContext();
    const body = await req.json();
    const data = await createGeoTerritory(ctx, body);
    return jsonOk({ data }, 201);
  } catch (e) { return jsonError(e); }
}
