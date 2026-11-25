import { requireGeoContext } from "@lib/server/geo/auth";
import { jsonError, jsonOk } from "@lib/server/api-response";
import { detectTerritoryOverlaps } from "@lib/server/geo/territories";

export async function POST(req: Request) {
  try {
    const ctx = await requireGeoContext();
    const body = await req.json().catch(() => ({}));
    const data = await detectTerritoryOverlaps(ctx, body.territoryId);
    return jsonOk({ data, count: data.length });
  } catch (e) { return jsonError(e); }
}
