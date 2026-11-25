import { PageHeader } from "@/components/layout/page-header";
import { GeoExportWorkspace } from "./_components/GeoExportWorkspace";

export default function LocationExportPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Geographic Data Export" description="Export locations and territories as GeoJSON, WKT, or CSV." />
      <GeoExportWorkspace />
    </div>
  );
}