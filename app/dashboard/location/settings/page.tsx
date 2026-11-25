import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LocationSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Geographic Settings" description="Map providers, coordinate validation, import limits, and geospatial defaults." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="glass-card"><CardHeader className="pb-2"><CardTitle className="text-base">Coordinate System</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">All stored and exchanged coordinates use WGS84 (EPSG:4326). Longitude/latitude are validated at API and service boundaries.</CardContent></Card>
        <Card className="glass-card"><CardHeader className="pb-2"><CardTitle className="text-base">Import Limits</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Max import size 10MB. Max geometry complexity 50,000 vertices. Invalid geometries are rejected with validation errors.</CardContent></Card>
        <Card className="glass-card"><CardHeader className="pb-2"><CardTitle className="text-base">Map Providers</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Leaflet basemaps (OSM, Carto, Esri) are enabled by default. Google imagery and Mapbox/MapLibre styles require provider credentials in environment configuration.</CardContent></Card>
        <Card className="glass-card"><CardHeader className="pb-2"><CardTitle className="text-base">Audit</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Location and territory create/update/delete operations write GeoAuditLog records with actor, timestamp, and before/after payloads.</CardContent></Card>
      </div>
    </div>
  );
}