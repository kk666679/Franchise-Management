import { PageHeader } from "@/components/layout/page-header";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@lib/server/auth/session";
import { PosLocationClient } from "./_components/PosLocationClient";

export default async function PosLocationPage() {
  const session = await getCurrentSession();
  const organizationId = session?.org ?? (await prisma.organization.findFirst({ select: { id: true } }))?.id ?? null;
  const [locations, registers] = organizationId ? await Promise.all([
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
    prisma.posTerminal.findMany({ where: { organizationId }, orderBy: { code: "asc" }, include: { shifts: { where: { status: "OPEN" }, take: 1 } } }),
  ]) : [[], []];

  return (
    <div className="space-y-6">
      <PageHeader title="POS Locations" description="Manage POS registers by franchise location and view location coverage on the map." />
      <PosLocationClient
        initialLocations={locations.map((l) => ({ ...l, latitude: l.latitude == null ? null : Number(l.latitude), longitude: l.longitude == null ? null : Number(l.longitude) }))}
        initialRegisters={registers.map((r) => ({ id: r.id, code: r.code, name: r.name, locationId: r.locationId, active: r.active, hasOpenShift: r.shifts.length > 0 }))}
      />
    </div>
  );
}
