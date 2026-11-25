import { PageHeader } from "@/components/layout/page-header";
import { prisma } from "@/lib/prisma";
import { PosDashboardClient } from "./_components/PosDashboardClient";
import { getCurrentSession } from "@lib/server/auth/session";

export default async function POSPage() {
  const session = await getCurrentSession();
  const organizationId = session?.org ?? (await prisma.organization.findFirst({ select: { id: true } }))?.id ?? null;

  const [organization, locations, registers, products] = organizationId
    ? await Promise.all([
        prisma.organization.findUnique({ where: { id: organizationId }, select: { id: true, currency: true } }),
        prisma.franchiseLocation.findMany({
          where: { organizationId },
          orderBy: { name: "asc" },
          select: {
            id: true, name: true, code: true, status: true, locationType: true, businessStatus: true,
            addressLine1: true, city: true, state: true, country: true, latitude: true, longitude: true,
            brand: { select: { id: true, name: true } },
            assignedTerritory: { select: { id: true, name: true, territoryCode: true } },
          },
        }),
        prisma.posTerminal.findMany({
          where: { organizationId },
          orderBy: { code: "asc" },
          include: { shifts: { where: { status: "OPEN" }, orderBy: { openedAt: "desc" }, take: 1 } },
        }),
        prisma.product.findMany({
          where: { organizationId, active: true },
          orderBy: { name: "asc" },
          take: 100,
          select: { id: true, name: true, sku: true, barcode: true, unitPrice: true },
        }),
      ])
    : [null, [], [], []];

  const currency = organization?.currency ?? "USD";

  return (
    <div className="space-y-6">
      <PageHeader title="Point of sale" description="Process sales, manage register sessions, and connect POS to franchise locations." />
      <PosDashboardClient
        currency={currency}
        initialLocations={locations.map((l) => ({
          ...l,
          latitude: l.latitude == null ? null : Number(l.latitude),
          longitude: l.longitude == null ? null : Number(l.longitude),
        }))}
        initialRegisters={registers.map((r) => ({
          id: r.id,
          code: r.code,
          name: r.name,
          locationId: r.locationId,
          locationName: null,
          active: r.active,
          openShift: r.shifts[0]
            ? { id: r.shifts[0].id, openedAtIso: r.shifts[0].openedAt.toISOString(), openingFloatCents: Math.round(Number(r.shifts[0].openingFloat) * 100) }
            : null,
        }))}
        initialProducts={products.map((p) => ({
          id: p.id,
          name: p.name,
          sku: p.sku,
          priceCents: Math.round(Number(p.unitPrice) * 100),
          currency,
          inStock: 99,
          barcode: p.barcode,
        }))}
      />
    </div>
  );
}
