import { NextResponse } from "next/server";
import { jsonError, jsonOk } from "@lib/server/api-response";
import { requirePosContext } from "@/lib/server/pos/context";
import { listPosLocations } from "@/lib/server/pos/service";

export async function GET() {
  try {
    const ctx = await requirePosContext();
    const rows = await listPosLocations(ctx);
    const data = rows.map((l) => ({
      id: l.id,
      name: l.name,
      code: l.code,
      status: l.status,
      locationType: l.locationType,
      businessStatus: l.businessStatus,
      addressLine1: l.addressLine1,
      city: l.city,
      state: l.state,
      country: l.country,
      latitude: l.latitude == null ? null : Number(l.latitude),
      longitude: l.longitude == null ? null : Number(l.longitude),
      brand: l.brand,
      assignedTerritory: l.assignedTerritory,
    }));
    return jsonOk({ data });
  } catch (e) {
    return jsonError(e);
  }
}
