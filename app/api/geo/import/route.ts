import { requireGeoContext } from "@/app/dashboard/location/_server/auth";
import { jsonError, jsonOk } from "@lib/server/api-response";
import { previewImport, detectFormat } from "@/app/dashboard/location/_lib/conversion";
import { createGeoLocation } from "@/app/dashboard/location/_server/locations";
import { createGeoTerritory } from "@/app/dashboard/location/_server/territories";
import { prisma } from "@/lib/prisma";
import { writeGeoAuditLog } from "@/app/dashboard/location/_server/audit";

export async function POST(req: Request) {
  try {
    const ctx = await requireGeoContext();
    const contentType = req.headers.get("content-type") ?? "";
    let fileName = "import.geojson";
    let content = "";
    let entityType = "locations";

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file");
      entityType = String(form.get("entityType") ?? "locations");
      if (file instanceof File) { fileName = file.name; content = await file.text(); }
      else throw new Error("Missing file");
    } else {
      const body = await req.json();
      fileName = body.fileName ?? fileName;
      content = body.content ?? "";
      entityType = body.entityType ?? "locations";
      if (body.preview) {
        const preview = await previewImport(fileName, content, body.contentType);
        return jsonOk({ data: preview });
      }
    }

    const preview = await previewImport(fileName, content);
    if (!preview.valid) {
      return jsonOk({ data: { ...preview, imported: 0 } }, 422);
    }

    const job = await prisma.geoImportJob.create({
      data: {
        organizationId: ctx.organizationId,
        fileName, format: preview.format, status: "VALIDATING",
        totalFeatures: preview.featureCount, validFeatures: preview.featureCount, invalidFeatures: 0,
        createdById: ctx.userId || null,
      },
    });

    let imported = 0;
    const errors: any[] = [];
    for (const f of preview.features.features) {
      try {
        if (entityType === "territories") {
          if (f.geometry?.type !== "Polygon" && f.geometry?.type !== "MultiPolygon") { errors.push({ id: f.id, error: "Territory import requires Polygon/MultiPolygon" }); continue; }
          const p = f.properties ?? {};
          await createGeoTerritory(ctx, {
            name: String(p.name ?? p.territoryName ?? `Imported Territory ${imported + 1}`),
            territoryCode: String(p.territoryCode ?? p.code ?? `T-${Date.now()}-${imported + 1}`),
            territoryType: String(p.territoryType ?? "NON_EXCLUSIVE"),
            exclusivityStatus: String(p.exclusivityStatus ?? "NON_EXCLUSIVE"),
            status: String(p.status ?? "DRAFT"),
            geometry: f.geometry,
            brandId: p.brandId ?? null,
            country: p.country ?? null, state: p.state ?? null, district: p.district ?? null,
            metadata: p,
          });
        } else {
          if (f.geometry?.type !== "Point") { errors.push({ id: f.id, error: "Location import requires Point geometry" }); continue; }
          const [lng, lat] = f.geometry.coordinates as [number, number];
          const p = f.properties ?? {};
          await createGeoLocation(ctx, {
            name: String(p.name ?? p.locationName ?? `Imported Location ${imported + 1}`),
            outletCode: String(p.outletCode ?? p.code ?? `LOC-${Date.now()}-${imported + 1}`),
            locationType: String(p.locationType ?? "FRANCHISE_OUTLET"),
            businessStatus: String(p.businessStatus ?? "ACTIVE"),
            addressLine1: String(p.addressLine1 ?? p.address ?? "Imported address"),
            city: String(p.city ?? "Unknown"),
            postcode: String(p.postcode ?? p.postalCode ?? "00000"),
            country: String(p.country ?? "US"),
            state: p.state ?? null, district: p.district ?? null,
            latitude: lat, longitude: lng,
            brandId: p.brandId ?? null,
            franchiseeId: p.franchiseeId ?? null,
            geoMetadata: p,
          });
        }
        imported++;
      } catch (err: any) {
        errors.push({ id: f.id, error: err?.message ?? "Import failed" });
      }
    }

    await prisma.geoImportJob.update({
      where: { id: job.id },
      data: {
        status: errors.length ? "FAILED" : "IMPORTED",
        importedCount: imported,
        invalidFeatures: errors.length,
        errors: errors as any,
        warnings: preview.warnings as any,
        completedAt: new Date(),
      },
    });
    await writeGeoAuditLog({ organizationId: ctx.organizationId, entityType: "import", entityId: job.id, action: "IMPORT", actorId: ctx.userId, metadata: { fileName, imported, errors: errors.length } }).catch(() => {});

    return jsonOk({ data: { jobId: job.id, imported, errors, warnings: preview.warnings, format: preview.format, total: preview.featureCount } }, imported ? 201 : 200);
  } catch (e) { return jsonError(e); }
}
