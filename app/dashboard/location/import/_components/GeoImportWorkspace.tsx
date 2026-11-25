"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function GeoImportWorkspace() {
  const [fileName, setFileName] = useState("");
  const [content, setContent] = useState("");
  const [entityType, setEntityType] = useState("locations");
  const [preview, setPreview] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function onFile(file: File | null) {
    if (!file) return;
    setFileName(file.name);
    setContent(await file.text());
    setPreview(null);
    setResult(null);
  }

  async function doPreview() {
    setLoading(true);
    try {
      const res = await fetch("/api/geo/validate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fileName, content, preview: true }) });
      const j = await res.json();
      setPreview(j.data ?? j);
    } finally { setLoading(false); }
  }

  async function doImport() {
    setLoading(true);
    try {
      const res = await fetch("/api/geo/import", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fileName, content, entityType }) });
      const j = await res.json();
      setResult(j.data ?? j);
    } finally { setLoading(false); }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="glass-card">
        <CardHeader className="pb-3"><CardTitle className="text-base">Import File</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input type="file" accept=".geojson,.json,.kml,.gpx,.wkt,.csv,.osm" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
          <select className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm" value={entityType} onChange={(e) => setEntityType(e.target.value)}>
            <option value="locations">Locations (Point features)</option>
            <option value="territories">Territories (Polygon/MultiPolygon)</option>
          </select>
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Or paste GeoJSON/WKT/KML/CSV content..." className="min-h-[220px] font-mono text-xs" />
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={doPreview} disabled={!content || loading}>Validate / Preview</Button>
            <Button size="sm" onClick={doImport} disabled={!content || loading}>Import</Button>
          </div>
        </CardContent>
      </Card>
      <Card className="glass-card">
        <CardHeader className="pb-3"><CardTitle className="text-base">Preview / Result</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {preview && (
            <div className="rounded-xl border border-border p-3 text-sm">
              <div>Format: <span className="font-medium">{preview.format}</span></div>
              <div>Features: <span className="font-medium">{preview.featureCount}</span></div>
              <div>Geometry types: {preview.geometryTypes?.join(", ") || "—"}</div>
              <div>Valid: {String(preview.valid)}</div>
              {preview.issues?.length > 0 && <pre className="mt-2 max-h-48 overflow-auto rounded bg-muted p-2 text-xs">{JSON.stringify(preview.issues.slice(0, 20), null, 2)}</pre>}
            </div>
          )}
          {result && (
            <div className="rounded-xl border border-border p-3 text-sm">
              <div>Imported: <span className="font-medium">{result.imported}</span> / {result.total}</div>
              {result.errors?.length > 0 && <pre className="mt-2 max-h-48 overflow-auto rounded bg-muted p-2 text-xs">{JSON.stringify(result.errors.slice(0, 20), null, 2)}</pre>}
            </div>
          )}
          {!preview && !result && <p className="text-sm text-muted-foreground">Upload or paste data to preview validation results.</p>}
        </CardContent>
      </Card>
    </div>
  );
}