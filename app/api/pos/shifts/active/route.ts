import { jsonError, jsonOk } from "@lib/server/api-response";
import { requirePosContext } from "@/lib/server/pos/context";
import { prisma } from "@/lib/prisma";
import { mapPosShiftView } from "@/lib/server/pos/service";

export async function GET(req: Request) {
  try {
    const ctx = await requirePosContext();
    const url = new URL(req.url);
    const terminalId = url.searchParams.get("terminalId");
    if (!terminalId) return jsonOk({ data: null });
    const shift = await prisma.cashierShift.findFirst({
      where: { organizationId: ctx.organizationId, terminalId, status: "OPEN" },
      include: { terminal: true },
      orderBy: { openedAt: "desc" },
    });
    return jsonOk({ data: shift ? mapPosShiftView(shift) : null });
  } catch (e) {
    return jsonError(e);
  }
}
