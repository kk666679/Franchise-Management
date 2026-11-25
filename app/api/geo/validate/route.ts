import { requireGeoContext } from "@/app/dashboard/location/_server/auth";
import { jsonError, jsonOk } from "@lib/server/api-response";
import { validateFeatureCollection } from "@/app/dashboard/location/_lib/validation";
import { previewImport, detectFormat, convertToGeoJSON } from "@/app/dashboard/location/_lib/conversion";

export async function POST(req: Request) {
  try {
    await requireGeoContext();
    const body = await req.json();
    if (body.content && (body.fileName || body.format)) {
      // conversion/preview mode
      const format = body.format ?? detectFormat(body.fileName ?? "input.json", body.contentType, body.content);
      if (body.preview) {
        const preview = await previewImport(body.fileName ?? "input", body.content, body.contentType);
        return jsonOk({ data: preview });
      }
      const fc = await convertToGeoJSON(body.content, format);
      return jsonOk({ data: { format, featureCollection: fc, validation: validateFeatureCollection(fc) } });
    }
    // direct GeoJSON validation
    const validation = validateFeatureCollection(body.geojson ?? body);
    return jsonOk({ data: validation });
  } catch (e) { return jsonError(e); }
}
