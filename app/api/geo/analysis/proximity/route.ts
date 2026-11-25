import { requireGeoContext } from "@lib/server/geo/auth";
import { jsonError, jsonOk } from "@lib/server/api-response";
import { runCannibalizationAnalysis } from "@lib/server/geo/analysis";

export async function POST(req: Request) {
  try {
    const ctx = await requireGeoContext();
    const body = await req.json().catch(() => ({}));
    const thresholdKm = Number(body.thresholdKm ?? 5);
    return jsonOk({ data: await runCannibalizationAnalysis(ctx, Number.isFinite(thresholdKm) ? thresholdKm : 5) });
  } catch (e) { return jsonError(e); }
}
