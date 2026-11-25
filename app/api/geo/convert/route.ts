import { requireGeoContext } from "@/app/dashboard/location/_server/auth";
import { jsonError, jsonOk } from "@lib/server/api-response";
import { convertToGeoJSON, detectFormat } from "@/app/dashboard/location/_lib/conversion";

export async function POST(req: Request) {
  try {
    await requireGeoContext();
    const body = await req.json();
    const format = body.format ?? detectFormat(body.fileName ?? "input", body.contentType, body.content);
    const fc = await convertToGeoJSON(body.content, format);
    return jsonOk({ data: { format, featureCollection: fc } });
  } catch (e) { return jsonError(e); }
}
