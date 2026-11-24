import Link from "next/link"
import { MapPin } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/feedback/empty-state"
import { Badge } from "@/components/ui/badge"
import { PERMISSIONS } from "@/lib/rbac"
import { listLocations } from "@lib/server/services/brands-locations"
import { prisma } from "@/lib/prisma"

export default async function LocationsPage() {
  const organizationId = (await prisma.organization.findFirst({ select: { id: true } }))?.id ?? ""
  
  const ctx = { userId: "", organizationId, membershipRole: "OWNER" as const }
  const locations = await listLocations(ctx)

  return (
    <div className="space-y-6">
        <PageHeader title="Locations" description={`${locations.length} franchise locations`} />
        {locations.length === 0 ? (
          <EmptyState title="No locations yet" description="Locations will appear here once branches are added." icon={<MapPin className="size-5" />} />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-card/60">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[52rem] text-left text-sm">
                <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr><th className="px-4 py-3">Location</th><th className="px-4 py-3">Brand</th><th className="px-4 py-3">Franchisee</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">City</th></tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {locations.map((l) => (
                    <tr key={l.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3"><Link href={`/dashboard/locations/${l.id}`} className="font-medium hover:text-primary">{l.name}</Link><p className="text-xs text-muted-foreground font-mono">{l.code}</p></td>
                      <td className="px-4 py-3 text-muted-foreground">{l.brand.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{l.franchisee?.tradingName ?? l.franchisee?.legalName ?? "—"}</td>
                      <td className="px-4 py-3"><Badge variant="secondary" className="text-xs">{l.status}</Badge></td>
                      <td className="px-4 py-3 text-muted-foreground">{[l.city, l.state].filter(Boolean).join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  )
}
