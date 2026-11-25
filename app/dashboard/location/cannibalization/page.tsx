import { PageHeader } from "@/components/layout/page-header";
import { requireGeoContext } from "@/app/dashboard/location/_server/auth";
import { runCannibalizationAnalysis } from "@/app/dashboard/location/_server/analysis";
import { CannibalizationDashboard } from "./_components/CannibalizationDashboard";

export default async function LocationCannibalizationPage() {
  let data: any = null;
  try { const ctx = await requireGeoContext(); data = await runCannibalizationAnalysis(ctx, 5); } catch {}
  return (
    <div className="space-y-6">
      <PageHeader title="Cannibalization Analysis" description="Distance-based proximity risk indicators and territory overlap conflicts." />
      <CannibalizationDashboard initialData={data} />
    </div>
  );
}