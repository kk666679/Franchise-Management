import { jsonError, jsonOk } from "@lib/server/api-response";
import { requirePosContext } from "@/lib/server/pos/context";
import { getActiveShift, mapPosShiftView, openPosShift } from "@/lib/server/pos/service";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const ctx = await requirePosContext();
    const { id } = await params;
    const shift = await getActiveShift(ctx, id);
    return jsonOk({ data: shift ? mapPosShiftView(shift) : null });
  } catch (e) {
    return jsonError(e);
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const ctx = await requirePosContext();
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const opening = body.openingFloat ?? ((typeof body.openingFloatCents === "number") ? body.openingFloatCents / 100 : 0);
    const shift = await openPosShift(ctx, { terminalId: id, openingFloat: opening });
    return jsonOk({ data: mapPosShiftView(shift) }, 201);
  } catch (e) {
    return jsonError(e);
  }
}
