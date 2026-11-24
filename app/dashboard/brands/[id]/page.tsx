import { notFound } from "next/navigation"
import { GitBranch } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { PERMISSIONS } from "@/lib/rbac"
import { getBrand } from "@lib/server/services/brands-locations"
import { NotFoundError } from "@lib/server/errors"
import { prisma } from "@/lib/prisma"

export default async function BrandDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const organizationId = (await prisma.organization.findFirst({ select: { id: true } }))?.id ?? ""
  
  const ctx = { userId: "", organizationId, membershipRole: "OWNER" as const }
  let brand
  try { brand = await getBrand(ctx, id) } catch (e) { if (e instanceof NotFoundError) notFound(); throw e }

  return (
    <div className="space-y-6">
      <PageHeader title={brand.name} description={brand.description ?? `/${brand.slug}`} actions={<Badge variant="secondary">{brand.status}</Badge>} />
      <div className="grid gap-3 sm:grid-cols-3">
        {[["Franchisees", brand.franchisees.length], ["Locations", brand.locations.length], ["Agreements", brand.agreements.length]].map(([label, value]) => (
          <div key={String(label)} className="rounded-2xl p-4 glass"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p></div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card/60 overflow-hidden">
          <div className="border-b border-border px-4 py-3 text-sm font-semibold">Franchisees</div>
          <ul className="divide-y divide-border/70">{brand.franchisees.map((f) => <li key={f.id} className="px-4 py-3 text-sm flex justify-between"><span>{f.tradingName ?? f.legalName}</span><Badge variant="secondary" className="text-xs">{f.status}</Badge></li>)}{brand.franchisees.length === 0 && <li className="px-4 py-3 text-sm text-muted-foreground">No franchisees.</li>}</ul>
        </div>
        <div className="rounded-2xl border border-border bg-card/60 overflow-hidden">
          <div className="border-b border-border px-4 py-3 text-sm font-semibold">Locations</div>
          <ul className="divide-y divide-border/70">{brand.locations.map((l) => <li key={l.id} className="px-4 py-3 text-sm flex justify-between"><span>{l.name} <span className="text-muted-foreground">({l.code})</span></span><Badge variant="secondary" className="text-xs">{l.status}</Badge></li>)}{brand.locations.length === 0 && <li className="px-4 py-3 text-sm text-muted-foreground">No locations.</li>}</ul>
        </div>
      </div>
    </div>
  )
}
