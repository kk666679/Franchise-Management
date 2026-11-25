import { jsonError, jsonOk } from "@lib/server/api-response";
import { requirePosContext } from "@/lib/server/pos/context";
import { listPosProducts } from "@/lib/server/pos/service";

export async function GET(req: Request) {
  try {
    const ctx = await requirePosContext();
    const q = new URL(req.url).searchParams.get("q") ?? undefined;
    const products = await listPosProducts(ctx, q);
    return jsonOk({
      data: products.map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        barcode: p.barcode,
        priceCents: Math.round(Number(p.unitPrice) * 100),
        taxRate: Number(p.taxRate),
        currency: "USD",
        inStock: 99,
      })),
    });
  } catch (e) {
    return jsonError(e);
  }
}
