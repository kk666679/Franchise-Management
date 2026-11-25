import { requireGeoContext } from "@lib/server/geo/auth";
import { jsonError, jsonOk } from "@lib/server/api-response";
import { runSiteSelection } from "@lib/server/geo/analysis";

export async function POST(req: Request) {
  try {
    const ctx = await requireGeoContext();
    const body = await req.json();
    const { lng, lat, tradeAreaRadiusKm, brandId } = body ?? {};
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
      return jsonOk({ error: "lng and lat are required numbers" }, 422);
    }
    const data = await runSiteSelection(ctx, {
      proposedPoint: [Number(lng), Number(lat)],
      tradeAreaRadiusKm: tradeAreaRadiusKm ? Number(tradeAreaRadiusKm) : undefined,
      brandId: brandId ?? null,
    });
    return jsonOk({ data });
  } catch (e) { return jsonError(e); }
}
