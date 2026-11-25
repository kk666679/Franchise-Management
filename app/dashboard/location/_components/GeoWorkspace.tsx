"use client";

import { useMemo, useState } from "react";
import { LeafletGeoMap, type GeoLocationRecord, type GeoTerritoryRecord } from "../_components/map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LOCATION_TYPE_LABELS, type FranchiseLocationType } from "../_lib/constants";
import { cn } from "@/lib/utils";

type Props = {
  initialLocations: GeoLocationRecord[];
  initialTerritories: GeoTerritoryRecord[];
};

export function GeoWorkspace({ initialLocations, initialTerritories }: Props) {
  const [locations, setLocations] = useState(initialLocations);
  const [territories, setTerritories] = useState(initialTerritories);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawMode, setDrawMode] = useState<"none" | "point" | "polygon">("none");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return locations.filter((l) => {
      if (typeFilter !== "all" && l.locationType !== typeFilter) return false;
      if (!q) return true;
      return [l.name, l.code, l.city, l.state, l.country, l.brand?.name, l.franchisee?.tradingName, l.franchisee?.legalName]
        .filter(Boolean).some((v) => String(v).toLowerCase().includes(q));
    });
  }, [locations, search, typeFilter]);

  const selected = locations.find((l) => l.id === selectedId) ?? null;

  async function refresh() {
    const [locRes, terrRes] = await Promise.all([fetch("/api/geo/locations?limit=1000"), fetch("/api/geo/territories?limit=1000")]);
    if (locRes.ok) { const j = await locRes.json(); setLocations(j.data ?? []); }
    if (terrRes.ok) { const j = await terrRes.json(); setTerritories(j.data ?? []); }
  }

  async function handleDrawComplete(geometry: any) {
    if (geometry.type === "Point") {
      const name = window.prompt("Location name");
      if (!name) return;
      const code = window.prompt("Outlet code", `LOC-${Date.now().toString().slice(-6)}`) ?? "";
      if (!code) return;
      const res = await fetch("/api/geo/locations", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, outletCode: code, locationType: "FRANCHISE_OUTLET", businessStatus: "PLANNED",
          addressLine1: "TBD", city: "TBD", postcode: "00000", country: "US",
          longitude: geometry.coordinates[0], latitude: geometry.coordinates[1],
        }),
      });
      if (res.ok) { setDrawMode("none"); await refresh(); }
      else { const err = await res.json().catch(() => ({})); alert(err.error ?? "Failed to create location"); }
    } else if (geometry.type === "Polygon") {
      const name = window.prompt("Territory name");
      if (!name) return;
      const code = window.prompt("Territory code", `TER-${Date.now().toString().slice(-6)}`) ?? "";
      if (!code) return;
      const res = await fetch("/api/geo/territories", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, territoryCode: code, territoryType: "NON_EXCLUSIVE", exclusivityStatus: "NON_EXCLUSIVE", status: "DRAFT", geometry,
        }),
      });
      if (res.ok) { setDrawMode("none"); await refresh(); }
      else { const err = await res.json().catch(() => ({})); alert(err.error ?? "Failed to create territory"); }
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
      <Card className="glass-card h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Locations & Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Button size="sm" variant={drawMode === "point" ? "default" : "outline"} onClick={() => setDrawMode(drawMode === "point" ? "none" : "point")}>Drop Point</Button>
            <Button size="sm" variant={drawMode === "polygon" ? "default" : "outline"} onClick={() => setDrawMode(drawMode === "polygon" ? "none" : "polygon")}>Draw Territory</Button>
            <Button size="sm" variant="ghost" onClick={refresh}>Refresh</Button>
          </div>
          {drawMode === "polygon" && <p className="text-xs text-muted-foreground">Click to add vertices, double-click to finish polygon.</p>}
          <Input placeholder="Search locations..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">All location types</option>
            {Object.entries(LOCATION_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <div className="max-h-[420px] space-y-2 overflow-auto pr-1">
            {filtered.map((l) => (
              <button key={l.id} onClick={() => setSelectedId(l.id)} className={cn("w-full rounded-xl border p-3 text-left transition", selectedId === l.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40")}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-medium leading-tight">{l.name}</div>
                    <div className="text-xs text-muted-foreground">{l.code} · {l.city ?? "—"}</div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{l.businessStatus ?? l.status}</Badge>
                </div>
              </button>
            ))}
            {filtered.length === 0 && <p className="text-sm text-muted-foreground">No locations match filters.</p>}
          </div>
          {selected && (
            <div className="rounded-xl border border-border bg-muted/20 p-3 text-sm">
              <div className="font-semibold">{selected.name}</div>
              <div className="text-muted-foreground">{LOCATION_TYPE_LABELS[selected.locationType] ?? selected.locationType}</div>
              <div>{[selected.addressLine1, selected.city, selected.state, selected.country].filter(Boolean).join(", ")}</div>
              {selected.brand?.name && <div>Brand: {selected.brand.name}</div>}
              {selected.assignedTerritory && <div>Territory: {selected.assignedTerritory.name}</div>}
            </div>
          )}
        </CardContent>
      </Card>

      <LeafletGeoMap
        locations={filtered}
        territories={territories}
        selectedLocationId={selectedId}
        onSelectLocation={setSelectedId}
        drawMode={drawMode}
        onDrawComplete={handleDrawComplete}
        height="720px"
      />
    </div>
  );
}