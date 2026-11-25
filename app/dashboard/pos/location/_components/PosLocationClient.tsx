"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const LeafletGeoMap = dynamic(() => import("@/app/dashboard/location/_components/map/LeafletGeoMap").then((m) => m.LeafletGeoMap), { ssr: false });

type Location = { id: string; name: string; code: string; status: string; businessStatus?: string | null; addressLine1?: string | null; city?: string | null; state?: string | null; country?: string | null; latitude: number | null; longitude: number | null; brand?: { id: string; name: string } | null; assignedTerritory?: { id: string; name: string; territoryCode: string } | null };
type Register = { id: string; code: string; name: string; locationId?: string | null; active: boolean; hasOpenShift: boolean };

export function PosLocationClient({ initialLocations, initialRegisters }: { initialLocations: Location[]; initialRegisters: Register[] }) {
  const [locations] = useState(initialLocations);
  const [registers, setRegisters] = useState(initialRegisters);
  const [selectedLocationId, setSelectedLocationId] = useState(initialLocations[0]?.id ?? "");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const selected = locations.find((l) => l.id === selectedLocationId) ?? null;
  const locationRegisters = useMemo(() => registers.filter((r) => r.locationId === selectedLocationId), [registers, selectedLocationId]);

  const create = async () => {
    setError(null);
    const res = await fetch("/api/pos/registers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ locationId: selectedLocationId || null, code, name }) });
    const json = await res.json().catch(() => null);
    if (!res.ok) { setError(json?.error ?? "Failed to create register"); return; }
    setRegisters((prev) => [...prev, { id: json.data.id, code: json.data.code, name: json.data.name, locationId: json.data.locationId, active: json.data.active, hasOpenShift: false }]);
    setCode(""); setName("");
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Location registers</CardTitle><CardDescription>Create and review registers by location.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5"><Label>Location</Label><Select value={selectedLocationId} onValueChange={setSelectedLocationId}><SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger><SelectContent>{locations.map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2 rounded-md border border-border p-3"><p className="text-sm font-medium">New register</p><Input placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)} /><Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} /><Button size="sm" onClick={() => void create()} disabled={!code.trim() || !name.trim() || !selectedLocationId}>Create</Button>{error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}</div>
          <div className="space-y-2">{locationRegisters.map((r) => <div key={r.id} className="flex items-center justify-between rounded-md border border-border p-2 text-sm"><div><div className="font-medium">{r.name}</div><div className="text-muted-foreground">{r.code}</div></div><div className="flex gap-2"><Badge variant={r.active ? "default" : "outline"}>{r.active ? "Active" : "Inactive"}</Badge>{r.hasOpenShift ? <Badge variant="secondary">Open shift</Badge> : null}</div></div>)}{locationRegisters.length === 0 ? <p className="text-sm text-muted-foreground">No registers for this location.</p> : null}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Location map</CardTitle><CardDescription>{selected ? `${selected.name} · ${selected.code}` : "Select a location"}</CardDescription></CardHeader>
        <CardContent>
          <LeafletGeoMap
            locations={locations.filter((l) => l.latitude != null && l.longitude != null).map((l) => ({ id: l.id, name: l.name, code: l.code, locationType: "FRANCHISE_OUTLET" as const, status: l.status, businessStatus: l.businessStatus, latitude: l.latitude, longitude: l.longitude, addressLine1: l.addressLine1, city: l.city, state: l.state, country: l.country, brand: l.brand ?? null, franchisee: null, assignedTerritory: l.assignedTerritory ?? null }))}
            territories={[]}
            selectedLocationId={selectedLocationId}
            onSelectLocation={setSelectedLocationId}
            height="620px"
          />
        </CardContent>
      </Card>
    </div>
  );
}
