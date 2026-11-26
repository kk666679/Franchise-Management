import { requireGeoContext } from "@lib/server/auth";
import { jsonError, jsonOk } from "@lib/server/api-response";
import { getGeoTerritory, updateGeoTerritory, deleteGeoTerritory } from "@/app/dashboard/location/_server/territories";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const ctx = await requireGeoContext();
    const { id } = await params;
    return jsonOk({ data: await getGeoTerritory(ctx, id) });
  } catch (e) { return jsonError(e); }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const ctx = await requireGeoContext();
    const { id } = await params;
    const body = await req.json();
    return jsonOk({ data: await updateGeoTerritory(ctx, id, body) });
  } catch (e) { return jsonError(e); }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const ctx = await requireGeoContext();
    const { id } = await params;
    return jsonOk(await deleteGeoTerritory(ctx, id));
  } catch (e) { return jsonError(e); }
}
