"use client";

import { useState } from "react";
import { LeafletGeoMap } from "@/app/dashboard/location/_components/map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function SiteSelectionWorkspace({ locations, territories }: { locations: any[]; territories: any[] }) {
  const [candidate, setCandidate] = useState<[number, number] | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function evaluate() {
    if (!candidate) return;
    setLoading(true);
    try {
      const res = await fetch("/api/geo/analysis/site-selection", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lng: candidate[0], lat: candidate[1] }),
      });
      const j = await res.json();
      if (res.ok) setResult(j.data); else alert(j.error ?? "Evaluation failed");
    } finally { setLoading(false); }
  }

  const candidateFeature = candidate ? [{ id: "candidate", name: "Candidate", code: "CAND", locationType: "PLANNED_LOCATION", status: "PLANNED", latitude: candidate[1], longitude: candidate[0] }] : [];

  return (
    <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
      <Card className="glass-card h-fit">
        <CardHeader className="pb-3"><CardTitle className="text-base">Candidate Evaluation</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">Click the map to place a proposed outlet, then run evaluation.</p>
          <div className="flex gap-2">
            <Button size="sm" onClick={evaluate} disabled={!candidate || loading}>{loading ? "Evaluating..." : "Evaluate Site"}</Button>
            <Button size="sm" variant="outline" onClick={() => { setCandidate(null); setResult(null); }}>Clear</Button>
          </div>
          {candidate && <div className="text-xs text-muted-foreground">Candidate: {candidate[1].toFixed(5)}, {candidate[0].toFixed(5)}</div>}
          {result && (
            <div className="space-y-3 rounded-xl border border-border p-3 text-sm">
              <div className="flex items-center justify-between"><span className="font-semibold">Score</span><Badge>{result.score}/100</Badge></div>
              <div className="space-y-2">
                {result.scoreBreakdown?.map((b: any) => (
                  <div key={b.factor}>
                    <div className="flex justify-between text-xs"><span>{b.factor}</span><span>{b.score.toFixed(0)}</span></div>
                    <div className="h-1.5 rounded bg-muted"><div className="h-1.5 rounded bg-primary" style={{ width: `${b.score}%` }} /></div>
                    <div className="text-[11px] text-muted-foreground">{b.reason}</div>
                  </div>
                ))}
              </div>
              {result.missingData?.length > 0 && (
                <div className="text-xs text-amber-600">Missing data: {result.missingData.join("; ")}</div>
              )}
              {result.assumptions?.length > 0 && (
                <div className="text-xs text-muted-foreground">Assumptions: {result.assumptions.join(" ")}</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      <LeafletGeoMap
        locations={[...locations, ...candidateFeature] as any}
        territories={territories}
        onMapClick={(lat, lng) => setCandidate([lng, lat])}
        height="720px"
      />
    </div>
  );
}