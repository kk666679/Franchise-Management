"use client";

import { useMemo, useState } from "react";
import { LeafletGeoMap } from "@/app/dashboard/location/_components/map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function HeatmapWorkspace({ locations }: { locations: any[] }) {
  const [metric, setMetric] = useState<"density" | "active" | "planned">("density");
  const filtered = useMemo(() => {
    if (metric === "active") return locations.filter((l) => (l.businessStatus ?? l.status) === "ACTIVE");
    if (metric === "planned") return locations.filter((l) => ["PLANNED", "PLANNING"].includes(l.businessStatus ?? l.status));
    return locations;
  }, [locations, metric]);

  const byType = useMemo(() => {
    const m = new Map<string, number>();
    for (const l of filtered) m.set(l.locationType, (m.get(l.locationType) ?? 0) + 1);
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [filtered]);

  return (
    <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
      <Card className="glass-card h-fit">
        <CardHeader className="pb-3"><CardTitle className="text-base">Density Filters</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <select className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm" value={metric} onChange={(e) => setMetric(e.target.value as any)}>
            <option value="density">All locations</option>
            <option value="active">Active only</option>
            <option value="planned">Planned only</option>
          </select>
          <div className="text-sm text-muted-foreground">Showing {filtered.length} of {locations.length} locations.</div>
          <div className="space-y-2">
            {byType.map(([type, count]) => (
              <div key={type} className="flex items-center justify-between text-sm">
                <span>{type.replaceAll("_", " ")}</span>
                <Badge variant="outline">{count}</Badge>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Leaflet marker clustering provides density visualization. deck.gl WebGL heatmap layers can be enabled when large-scale analytics datasets are loaded.</p>
        </CardContent>
      </Card>
      <LeafletGeoMap locations={filtered} territories={[]} height="720px" />
    </div>
  );
}