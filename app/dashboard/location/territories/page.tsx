import { PageHeader } from "@/components/layout/page-header";
import { requireGeoContext } from "@lib/server/geo/auth";
import { listGeoTerritories } from "@lib/server/geo/territories";
import { TerritoryManager } from "./_components/TerritoryManager";

export default async function LocationTerritoriesPage() {
  let territories: any[] = [];
  try {
    const ctx = await requireGeoContext();
    territories = await listGeoTerritories(ctx, { limit: 1000 });
  } catch {}
  return (
    <div className="space-y-6">
      <PageHeader title="Territory Management" description="Draw, edit, assign, and audit franchise territory boundaries." />
      <TerritoryManager initialTerritories={territories} />
    </div>
  );
}