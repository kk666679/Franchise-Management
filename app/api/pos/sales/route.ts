import { jsonError, jsonOk } from "@lib/server/api-response";
import { requirePosContext } from "@/lib/server/pos/context";
import { createPosSale } from "@/lib/server/pos/service";

export async function POST(req: Request) {
  try {
    const ctx = await requirePosContext();
    const body = await req.json();
    const sale = await createPosSale(ctx, {
      receiptNo: String(body.receiptNo ?? ""),
      idempotencyKey: String(body.idempotencyKey ?? ""),
      terminalId: body.terminalId ?? null,
      shiftId: body.shiftId ?? null,
      customerId: body.customerId ?? null,
      lines: Array.isArray(body.lines) ? body.lines : [],
      payments: Array.isArray(body.payments) ? body.payments : [],
    });
    return jsonOk({ data: sale }, 201);
  } catch (e) {
    return jsonError(e);
  }
}
