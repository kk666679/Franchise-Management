import { jsonError, jsonOk } from "@lib/server/api-response";
import { requirePosContext } from "@/lib/server/pos/context";
import { closePosShift, mapPosShiftView } from "@/lib/server/pos/service";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const ctx = await requirePosContext();
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const shiftId = String(body.shiftId ?? "");
    if (!shiftId) return jsonOk({ error: "shiftId is required" }, 422);
    const shift = await closePosShift(ctx, {
      shiftId,
      countedCash: body.countedCash ?? body.countedCashCents / 100 ?? 0,
    });
    return jsonOk({ data: mapPosShiftView(shift) });
  } catch (e) {
    return jsonError(e);
  }
}
