import { requireGeoContext } from "@/app/dashboard/location/_server/auth";
import { jsonError, jsonOk } from "@lib/server/api-response";

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

export async function GET(req: Request) {
  try {
    await requireGeoContext();
    const url = new URL(req.url);
    const lat = Number(url.searchParams.get("lat"));
    const lng = Number(url.searchParams.get("lng"));
    const radius = Math.min(Number(url.searchParams.get("radius") ?? 1000), 5000);
    const amenity = url.searchParams.get("amenity") ?? "restaurant|cafe|school|hospital|parking";
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return jsonOk({ error: "lat and lng required" }, 422);

    const query = `[out:json][timeout:25];(node["amenity"~"${amenity}"](around:${radius},${lat},${lng});way["amenity"~"${amenity}"](around:${radius},${lat},${lng}););out center 40;`;
    const resp = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`,
    });
    if (!resp.ok) return jsonOk({ data: { elements: [] }, warning: `Overpass request failed: ${resp.status}` }, 502);
    const data = await resp.json();
    return jsonOk({ data, attribution: "© OpenStreetMap contributors" });
  } catch (e) { return jsonError(e); }
}
