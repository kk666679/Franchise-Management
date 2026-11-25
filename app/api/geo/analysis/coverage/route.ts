import { requireGeoContext } from "@lib/server/geo/auth";
import { jsonError, jsonOk } from "@lib/server/api-response";
import { runCoverageAnalysis } from "@lib/server/geo/analysis";

export async function POST() {
  try {
    const ctx = await requireGeoContext();
    return jsonOk({ data: await runCoverageAnalysis(ctx) });
  } catch (e) { return jsonError(e); }
}
