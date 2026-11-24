import Link from "next/link"
import { GitBranch } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/feedback/empty-state"
import { Badge } from "@/components/ui/badge"
import { PERMISSIONS } from "@/lib/rbac"
import { listBrands } from "@lib/server/services/brands-locations"
import { prisma } from "@/lib/prisma"

export default async function BrandsPage() {
  const organizationId = (await prisma.organization.findFirst({ select: { id: true } }))?.id ?? ""
  
  const ctx = { userId: "", organizationId, membershipRole: "OWNER" as const }
  const brands = await listBrands(ctx)

  return (
    <div className="space-y-6">
        <PageHeader title="Brands" description={`${brands.length} franchise brands`} />
        {brands.length === 0 ? (
          <EmptyState title="No brands yet" description="Brands define the franchise concepts operating in your organization." icon={<GitBranch className="size-5" />} />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-card/60">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Brand</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Franchisees</th>
                  <th className="px-4 py-3 text-right font-medium">Locations</th>
                  <th className="px-4 py-3 text-right font-medium">Agreements</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {brands.map((b) => (
                  <tr key={b.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3"><Link href={`/dashboard/brands/${b.id}`} className="font-medium hover:text-primary">{b.name}</Link><p className="text-xs text-muted-foreground">{b.slug}</p></td>
                    <td className="px-4 py-3"><Badge variant="secondary" className="text-xs">{b.status}</Badge></td>
                    <td className="px-4 py-3 text-right tabular-nums">{b._count.franchisees}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{b._count.locations}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{b._count.agreements}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  )
}
