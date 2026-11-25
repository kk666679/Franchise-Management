import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { getLocation } from "@lib/server/services/brands-locations";
import { NotFoundError } from "@lib/server/errors";
import { prisma } from "@/lib/prisma";

const dateFmt = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" });

export default async function LocationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const organizationId = (await prisma.organization.findFirst({ select: { id: true } }))?.id ?? "";
  const ctx = { userId: "", organizationId, membershipRole: "OWNER" as const };
  let location;
  try { location = await getLocation(ctx, id); } catch (e) { if (e instanceof NotFoundError) notFound(); throw e; }

  return (
    <div className="space-y-6">
      <PageHeader title={location.name} description={${location.code} · } actions={<Badge variant="secondary">{location.status}</Badge>} />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl p-6 glass">
          <h2 className="font-semibold">Location details</h2>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            {[["Address", [location.addressLine1, location.addressLine2].filter(Boolean).join(", ") || "—"], ["City", location.city], ["State", location.state ?? "—"], ["Postal code", location.postalCode], ["Country", location.country], ["Opened", location.openedAt ? dateFmt.format(location.openedAt) : "—"]].map(([k, v]) => (
              <div key={String(k)}><dt className="text-xs text-muted-foreground">{k}</dt><dd className="mt-0.5 font-medium">{v}</dd></div>
            ))}
          </dl>
        </div>
        <div className="space-y-4 rounded-2xl p-6 glass">
          <h2 className="font-semibold">Relationships</h2>
          <dl className="space-y-3 text-sm">
            <div><dt className="text-xs text-muted-foreground">Brand</dt><dd className="mt-0.5 font-medium">{location.brand.name}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Franchisee</dt><dd className="mt-0.5 font-medium">{location.franchisee?.tradingName ?? location.franchisee?.legalName ?? "—"}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Agreements</dt><dd className="mt-0.5 font-medium">{location.agreements.length}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Documents</dt><dd className="mt-0.5 font-medium">{location.documents.length}</dd></div>
          </dl>
        </div>
      </div>
    </div>
  );
}