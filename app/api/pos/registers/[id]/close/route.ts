import { NextResponse } from "next/server";
import { jsonError, jsonOk } from "@lib/server/api-response";
import { requirePosContext } from "@/lib/server/pos/context";
import { closePosShift, mapPosShiftView } from "@/lib/server/pos/service";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const ctx = await requirePosContext();
    await params;
    const body = await req.json().catch(() => ({}));
    const shiftId = String(body.shiftId ?? "");
    if (!shiftId) return NextResponse.json({ error: "shiftId is required" }, { status: 422 });
    const countedCash = body.countedCash ?? (typeof body.countedCashCents === "number" ? body.countedCashCents / 100 : 0);
    const shift = await closePosShift(ctx, { shiftId, countedCash });
    return jsonOk({ data: mapPosShiftView(shift) });
  } catch (e) {
    return jsonError(e);
  }
}
