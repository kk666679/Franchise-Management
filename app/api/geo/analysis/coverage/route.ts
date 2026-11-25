import { requireGeoContext } from "@/app/dashboard/location/_server/auth";
import { jsonError, jsonOk } from "@lib/server/api-response";
import { runCoverageAnalysis } from "@/app/dashboard/location/_server/analysis";

export async function POST() {
  try {
    const ctx = await requireGeoContext();
    return jsonOk({ data: await runCoverageAnalysis(ctx) });
  } catch (e) { return jsonError(e); }
}
