"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function GeoExportWorkspace() {
  const [entity, setEntity] = useState("all");
  const [format, setFormat] = useState("geojson");

  function download() {
    const url = `/api/geo/export?entity=${encodeURIComponent(entity)}&format=${encodeURIComponent(format)}`;
    window.open(url, "_blank");
  }

  return (
    <Card className="glass-card max-w-xl">
      <CardHeader className="pb-3"><CardTitle className="text-base">Export</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <label className="block text-sm">Entity
          <select className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm" value={entity} onChange={(e) => setEntity(e.target.value)}>
            <option value="all">All geographic features</option>
            <option value="locations">Locations</option>
            <option value="territories">Territories</option>
          </select>
        </label>
        <label className="block text-sm">Format
          <select className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm" value={format} onChange={(e) => setFormat(e.target.value)}>
            <option value="geojson">GeoJSON</option>
            <option value="wkt">WKT</option>
            <option value="csv">CSV (points)</option>
          </select>
        </label>
        <Button size="sm" onClick={download}>Export</Button>
      </CardContent>
    </Card>
  );
}