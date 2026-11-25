"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CoverageDashboard({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch("/api/geo/analysis/coverage", { method: "POST" });
      const j = await res.json();
      if (res.ok) setData(j.data);
    } finally { setLoading(false); }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2"><Button size="sm" onClick={refresh} disabled={loading}>{loading ? "Running..." : "Re-run Analysis"}</Button></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[["Total Locations", data?.totalLocations ?? 0], ["Avg Nearest Distance (km)", data?.averageNearestDistanceKm?.toFixed?.(2) ?? "—"], ["Coverage %", data?.coveragePercentage != null ? `${data.coveragePercentage.toFixed(1)}%` : "—"], ["States Covered", data?.byState?.length ?? 0]].map(([label, value]) => (
          <Card key={String(label)} className="glass-card"><CardContent className="p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-semibold">{String(value)}</p></CardContent></Card>
        ))}
      </div>
      {data?.coverageDenominator && <p className="text-xs text-muted-foreground">Coverage denominator: {data.coverageDenominator}</p>}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="glass-card">
          <CardHeader className="pb-2"><CardTitle className="text-base">By State</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {(data?.byState ?? []).slice(0, 12).map((r: any) => (
              <div key={r.state} className="flex items-center justify-between text-sm"><span>{r.state}</span><span className="font-medium tabular-nums">{r.count}</span></div>
            ))}
            {!data?.byState?.length && <p className="text-sm text-muted-foreground">No data.</p>}
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="pb-2"><CardTitle className="text-base">By District</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {(data?.byDistrict ?? []).slice(0, 12).map((r: any) => (
              <div key={r.district} className="flex items-center justify-between text-sm"><span>{r.district}</span><span className="font-medium tabular-nums">{r.count}</span></div>
            ))}
            {!data?.byDistrict?.length && <p className="text-sm text-muted-foreground">No data.</p>}
          </CardContent>
        </Card>
      </div>
      <Card className="glass-card">
        <CardHeader className="pb-2"><CardTitle className="text-base">Nearest Outlet Distances</CardTitle></CardHeader>
        <CardContent className="overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-muted-foreground"><tr><th className="py-2 pr-3">Location</th><th className="py-2 pr-3">Nearest</th><th className="py-2 text-right">Distance (km)</th></tr></thead>
            <tbody className="divide-y divide-border/60">
              {(data?.nearestDistances ?? []).slice(0, 20).map((r: any) => (
                <tr key={r.locationId}><td className="py-2 pr-3 font-mono text-xs">{r.locationId.slice(0, 8)}</td><td className="py-2 pr-3 font-mono text-xs">{r.nearestLocationId?.slice(0, 8) ?? "—"}</td><td className="py-2 text-right tabular-nums">{r.distanceKm?.toFixed?.(2) ?? "—"}</td></tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}