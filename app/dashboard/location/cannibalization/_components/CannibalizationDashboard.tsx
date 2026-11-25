"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function CannibalizationDashboard({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [threshold, setThreshold] = useState(5);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    try {
      const res = await fetch("/api/geo/analysis/proximity", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ thresholdKm: threshold }) });
      const j = await res.json();
      if (res.ok) setData(j.data);
    } finally { setLoading(false); }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-2">
        <label className="text-sm">Threshold (km)<Input type="number" min={0.5} step={0.5} value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="w-32" /></label>
        <Button size="sm" onClick={run} disabled={loading}>{loading ? "Running..." : "Run Analysis"}</Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="glass-card"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Proximity Alerts</p><p className="mt-1 text-2xl font-semibold">{data?.alerts?.length ?? 0}</p></CardContent></Card>
        <Card className="glass-card"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Territory Overlaps</p><p className="mt-1 text-2xl font-semibold">{data?.overlaps?.length ?? 0}</p></CardContent></Card>
        <Card className="glass-card"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Threshold</p><p className="mt-1 text-2xl font-semibold">{data?.thresholdKm ?? threshold} km</p></CardContent></Card>
      </div>
      <Card className="glass-card">
        <CardHeader className="pb-2"><CardTitle className="text-base">Proximity Alerts</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-muted-foreground">Distance-based indicators only; not proof of commercial cannibalization.</p>
          {(data?.alerts ?? []).slice(0, 50).map((a: any, i: number) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-border p-2 text-sm">
              <div><span className="font-mono text-xs">{a.locationAId.slice(0,8)} ? {a.locationBId.slice(0,8)}</span><div className="text-xs text-muted-foreground">{a.message}</div></div>
              <div className="flex items-center gap-2"><Badge variant={a.severity === "HIGH" ? "destructive" : a.severity === "MEDIUM" ? "secondary" : "outline"}>{a.severity}</Badge><span className="tabular-nums">{a.distanceKm.toFixed(2)} km</span></div>
            </div>
          ))}
          {!data?.alerts?.length && <p className="text-sm text-muted-foreground">No alerts at current threshold.</p>}
        </CardContent>
      </Card>
    </div>
  );
}