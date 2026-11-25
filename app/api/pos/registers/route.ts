import { jsonError, jsonOk } from "@lib/server/api-response";
import { requirePosContext } from "@/lib/server/pos/context";
import { ensurePosRegister, listPosRegisters, mapPosRegisterView } from "@/lib/server/pos/service";

export async function GET(req: Request) {
  try {
    const ctx = await requirePosContext();
    const url = new URL(req.url);
    const locationId = url.searchParams.get("locationId") ?? undefined;
    const registers = await listPosRegisters(ctx, locationId);
    return jsonOk({ data: registers.map((r) => mapPosRegisterView(r)) });
  } catch (e) {
    return jsonError(e);
  }
}

export async function POST(req: Request) {
  try {
    const ctx = await requirePosContext();
    const body = await req.json();
    const register = await ensurePosRegister(ctx, {
      locationId: body.locationId ?? null,
      code: String(body.code ?? "").trim(),
      name: String(body.name ?? "").trim(),
    });
    const mapped = mapPosRegisterView({ ...register, shifts: [] });
    return jsonOk({ data: mapped }, 201);
  } catch (e) {
    return jsonError(e);
  }
}
