import { PageHeader } from "@/components/layout/page-header";
import { requireGeoContext } from "@lib/server/auth";
import { listGeoLocations } from "@/app/dashboard/location/_server/locations";
import { listGeoTerritories } from "@/app/dashboard/location/_server/territories";
import { SiteSelectionWorkspace } from "./_components/SiteSelectionWorkspace";

export default async function LocationSiteSelectionPage() {
  let locations: any[] = []; let territories: any[] = [];
  try { const ctx = await requireGeoContext(); [locations, territories] = await Promise.all([listGeoLocations(ctx, { limit: 2000 }), listGeoTerritories(ctx, { limit: 1000 })]); } catch {}
  return (
    <div className="space-y-6">
      <PageHeader title="Site Selection" description="Evaluate candidate locations with distance, territory, and coverage scoring." />
      <SiteSelectionWorkspace locations={locations} territories={territories} />
    </div>
  );
}