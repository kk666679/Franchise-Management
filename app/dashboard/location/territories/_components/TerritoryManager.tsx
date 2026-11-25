"use client";

import { useMemo, useState } from "react";
import { LeafletGeoMap } from "@/app/dashboard/location/_components/map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Territory = any;

export function TerritoryManager({ initialTerritories }: { initialTerritories: Territory[] }) {
  const [territories, setTerritories] = useState<Territory[]>(initialTerritories);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawMode, setDrawMode] = useState<"none" | "polygon">("none");
  const [query, setQuery] = useState("");

  const selected = territories.find((t) => t.id === selectedId) ?? null;
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return territories;
    return territories.filter((t) => [t.name, t.territoryCode, t.status, t.territoryType].some((v) => String(v ?? "").toLowerCase().includes(q)));
  }, [territories, query]);

  async function refresh() {
    const res = await fetch("/api/geo/territories?limit=1000");
    if (res.ok) { const j = await res.json(); setTerritories(j.data ?? []); }
  }

  async function onDrawComplete(geometry: any) {
    if (geometry.type !== "Polygon") return;
    const name = window.prompt("Territory name");
    if (!name) return;
    const territoryCode = window.prompt("Territory code", `TER-${Date.now().toString().slice(-6)}`) || "";
    if (!territoryCode) return;
    const res = await fetch("/api/geo/territories", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, territoryCode, territoryType: "NON_EXCLUSIVE", exclusivityStatus: "NON_EXCLUSIVE", status: "DRAFT", geometry }),
    });
    if (res.ok) { setDrawMode("none"); await refresh(); }
    else { const err = await res.json().catch(() => ({})); alert(err.error ?? "Failed to create territory"); }
  }

  async function saveSelected(form: FormData) {
    if (!selected) return;
    const payload: any = {
      name: String(form.get("name") ?? selected.name),
      territoryCode: String(form.get("territoryCode") ?? selected.territoryCode),
      territoryType: String(form.get("territoryType") ?? selected.territoryType),
      status: String(form.get("status") ?? selected.status),
      exclusivityStatus: String(form.get("exclusivityStatus") ?? selected.exclusivityStatus),
      country: String(form.get("country") ?? selected.country ?? "") || null,
      state: String(form.get("state") ?? selected.state ?? "") || null,
      district: String(form.get("district") ?? selected.district ?? "") || null,
    };
    const res = await fetch(`/api/geo/territories/${selected.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) await refresh(); else alert((await res.json().catch(() => ({}))).error ?? "Update failed");
  }

  async function deleteSelected() {
    if (!selected) return;
    if (!window.confirm(`Delete territory "${selected.name}"?`)) return;
    const res = await fetch(`/api/geo/territories/${selected.id}`, { method: "DELETE" });
    if (res.ok) { setSelectedId(null); await refresh(); } else alert("Delete failed");
  }

  async function checkOverlaps() {
    const res = await fetch("/api/geo/analysis/overlap", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) return alert(j.error ?? "Overlap check failed");
    const overlaps = j.data ?? [];
    if (!overlaps.length) return alert("No overlapping territories detected.");
    alert(overlaps.slice(0, 10).map((o: any) => `${o.territoryAName} ? ${o.territoryBName}: ${(o.overlapAreaSqM / 1_000_000).toFixed(4)} km²${o.exclusiveConflict ? " (EXCLUSIVE CONFLICT)" : ""}`).join("\n"));
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
      <Card className="glass-card h-fit">
        <CardHeader className="pb-3"><CardTitle className="text-base">Territories</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant={drawMode === "polygon" ? "default" : "outline"} onClick={() => setDrawMode(drawMode === "polygon" ? "none" : "polygon")}>Draw</Button>
            <Button size="sm" variant="outline" onClick={checkOverlaps}>Check Overlaps</Button>
            <Button size="sm" variant="ghost" onClick={refresh}>Refresh</Button>
          </div>
          {drawMode === "polygon" && <p className="text-xs text-muted-foreground">Click map to add vertices; double-click to finish.</p>}
          <Input placeholder="Search territories..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <div className="max-h-[320px] space-y-2 overflow-auto pr-1">
            {filtered.map((t) => (
              <button key={t.id} onClick={() => setSelectedId(t.id)} className={`w-full rounded-xl border p-3 text-left ${selectedId === t.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div><div className="font-medium">{t.name}</div><div className="text-xs text-muted-foreground">{t.territoryCode}</div></div>
                  <Badge variant="outline" className="text-[10px]">{t.status}</Badge>
                </div>
              </button>
            ))}
          </div>

          {selected && (
            <form action={saveSelected} className="space-y-2 rounded-xl border border-border p-3">
              <div className="text-sm font-semibold">Edit Territory</div>
              <Input name="name" defaultValue={selected.name} placeholder="Name" />
              <Input name="territoryCode" defaultValue={selected.territoryCode} placeholder="Code" />
              <select name="territoryType" defaultValue={selected.territoryType} className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm">
                {["EXCLUSIVE","NON_EXCLUSIVE","RESTRICTED_DEVELOPMENT","PROTECTED","EXPANSION_OPPORTUNITY"].map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
              <select name="exclusivityStatus" defaultValue={selected.exclusivityStatus} className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm">
                {["EXCLUSIVE","NON_EXCLUSIVE"].map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
              <select name="status" defaultValue={selected.status} className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm">
                {["DRAFT","ACTIVE","PENDING","EXPIRED","ARCHIVED"].map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
              <div className="grid grid-cols-3 gap-2">
                <Input name="country" defaultValue={selected.country ?? ""} placeholder="Country" />
                <Input name="state" defaultValue={selected.state ?? ""} placeholder="State" />
                <Input name="district" defaultValue={selected.district ?? ""} placeholder="District" />
              </div>
              <div className="flex gap-2">
                <Button type="submit" size="sm">Save</Button>
                <Button type="button" size="sm" variant="destructive" onClick={deleteSelected}>Delete</Button>
              </div>
              <div className="text-xs text-muted-foreground">Area: {selected.areaSqKm?.toFixed?.(2) ?? "—"} km² · Perimeter: {selected.perimeterKm?.toFixed?.(2) ?? "—"} km</div>
            </form>
          )}
        </CardContent>
      </Card>
      <LeafletGeoMap locations={[]} territories={filtered} drawMode={drawMode} onDrawComplete={onDrawComplete} height="720px" />
    </div>
  );
}