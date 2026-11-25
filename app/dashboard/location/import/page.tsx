import { PageHeader } from "@/components/layout/page-header";
import { GeoImportWorkspace } from "./_components/GeoImportWorkspace";

export default function LocationImportPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Geographic Data Import" description="Import GeoJSON, KML, GPX, WKT, CSV, or OSM data with validation and preview." />
      <GeoImportWorkspace />
    </div>
  );
}