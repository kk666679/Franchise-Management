import { Building2, Plus } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/feedback/empty-state"
import {
  FranchiseTable,
  toFranchiseView,
} from "@/components/domain/franchise"
import type { FranchiseDTO } from "@/lib/server/mappers/franchise.dto"
import { prisma } from "@/lib/prisma"
import { FranchiseAISuggestions } from "./_components/franchise-ai-suggestions"

async function getFranchisees(orgId: string) {
  return prisma.franchisee.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      legalName: true,
      tradingName: true,
      status: true,
      email: true,
      createdAt: true,
      brand: { select: { name: true } },
      locations: { select: { id: true }, where: { status: "ACTIVE" } },
    },
  })
}

export default async function FranchisesPage() {
  const organizationId = (await prisma.organization.findFirst({ select: { id: true } }))?.id ?? ""
  const franchisees = await getFranchisees(organizationId ?? "")

  const active = franchisees.filter((f) => f.status === "ACTIVE").length
  const prospects = franchisees.filter((f) => f.status === "PROSPECT").length
  const onHold = franchisees.filter((f) => f.status === "ON_HOLD").length

  const rows = franchisees.map((franchisee) =>
    toFranchiseView({
      ...franchisee,
      territory: null,
    } satisfies FranchiseDTO)
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Franchisees"
        description={`${franchisees.length} total · ${active} active · ${prospects} prospects`}
        actions={
          <Button className="rounded-full" size="sm">
            <Plus className="size-4" />
            Add franchisee
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(
          [
            ["Total", franchisees.length],
            ["Active", active],
            ["Prospects", prospects],
            ["On hold", onHold],
          ] as const
        ).map(([label, count]) => (
          <div key={label} className="rounded-2xl p-4 glass">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{count}</p>
          </div>
        ))}
      </div>

      <FranchiseAISuggestions context="portfolio" />

      {franchisees.length === 0 ? (
        <EmptyState
          title="No franchisees yet"
          description="Add your first franchisee to get started."
          icon={<Building2 className="size-5" />}
        />
      ) : (
        <FranchiseTable data={rows} />
      )}
    </div>
  )
}

