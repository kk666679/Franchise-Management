import { PageHeader } from "@/components/layout/page-header";
import { requireGeoContext } from "@lib/server/geo/auth";
import { runCoverageAnalysis } from "@lib/server/geo/analysis";
import { CoverageDashboard } from "./_components/CoverageDashboard";

export default async function LocationCoveragePage() {
  let data: any = null;
  try { const ctx = await requireGeoContext(); data = await runCoverageAnalysis(ctx); } catch {}
  return (
    <div className="space-y-6">
      <PageHeader title="Coverage Analysis" description="Geographic distribution, concentration, and coverage gaps across franchise locations." />
      <CoverageDashboard initialData={data} />
    </div>
  );
}