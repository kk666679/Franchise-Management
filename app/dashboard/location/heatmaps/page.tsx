import { PageHeader } from "@/components/layout/page-header";
import { requireGeoContext } from "@/app/dashboard/location/_server/auth";
import { listGeoLocations } from "@/app/dashboard/location/_server/locations";
import { HeatmapWorkspace } from "./_components/HeatmapWorkspace";

export default async function LocationHeatmapsPage() {
  let locations: any[] = [];
  try { const ctx = await requireGeoContext(); locations = await listGeoLocations(ctx, { limit: 5000 }); } catch {}
  return (
    <div className="space-y-6">
      <PageHeader title="Heatmaps & Density" description="Visualize outlet density, coverage concentration, and expansion opportunities." />
      <HeatmapWorkspace locations={locations} />
    </div>
  );
}