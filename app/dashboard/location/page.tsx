import { PageHeader } from "@/components/layout/page-header";
import { requireGeoContext } from "@lib/server/geo/auth";
import { listGeoLocations } from "@lib/server/geo/locations";
import { listGeoTerritories } from "@lib/server/geo/territories";
import { GeoWorkspace } from "./_components/GeoWorkspace";

export default async function LocationOverviewPage() {
  let locations: any[] = [];
  let territories: any[] = [];
  try {
    const ctx = await requireGeoContext();
    [locations, territories] = await Promise.all([
      listGeoLocations(ctx, { limit: 1000 }),
      listGeoTerritories(ctx, { limit: 1000 }),
    ]);
  } catch {
    // unauthenticated or DB unavailable; render empty workspace
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Geographic Intelligence"
        description="Interactive map, franchise locations, territory boundaries, and spatial insights."
      />
      <GeoWorkspace initialLocations={locations as any} initialTerritories={territories as any} />
    </div>
  );
}