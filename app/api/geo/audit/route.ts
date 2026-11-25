import { requireGeoContext } from "@lib/server/geo/auth";
import { jsonError, jsonOk } from "@lib/server/api-response";
import { listGeoAuditLogs } from "@lib/server/geo/audit";

export async function GET(req: Request) {
  try {
    const ctx = await requireGeoContext();
    const url = new URL(req.url);
    const entityType = url.searchParams.get("entityType") ?? undefined;
    const entityId = url.searchParams.get("entityId") ?? undefined;
    const limit = url.searchParams.get("limit") ? Number(url.searchParams.get("limit")) : 50;
    const data = await listGeoAuditLogs(ctx.organizationId, entityType, entityId, limit);
    return jsonOk({ data, count: data.length });
  } catch (e) { return jsonError(e); }
}
