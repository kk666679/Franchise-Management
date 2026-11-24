import { MapPin } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/feedback/empty-state"
import { BranchTable } from "@/components/domain/franchise/BranchTable"
import type { BranchView } from "@/components/domain/franchise/mappers"
import { listLocations } from "@lib/server/services/brands-locations"
import { prisma } from "@/lib/prisma"

export default async function LocationsPage() {
  const organizationId = (await prisma.organization.findFirst({ select: { id: true } }))?.id ?? ""
  
  const ctx = { userId: "", organizationId, membershipRole: "OWNER" as const }
  const locations = await listLocations(ctx)
  const rows: BranchView[] = locations.map((location) => ({
    id: location.id,
    name: location.name,
    code: location.code,
    brandName: location.brand.name,
    franchiseName:
      location.franchisee?.tradingName ??
      location.franchisee?.legalName ??
      "—",
    addressLine: location.addressLine1,
    city: location.city,
    region: location.state ?? "",
    isActive: location.status === "ACTIVE",
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Locations"
        description={`${locations.length} franchise locations`}
      />
      {locations.length === 0 ? (
        <EmptyState
          title="No locations yet"
          description="Locations will appear here once branches are added."
          icon={<MapPin className="size-5" />}
        />
      ) : (
        <BranchTable data={rows} />
      )}
    </div>
  )
}
