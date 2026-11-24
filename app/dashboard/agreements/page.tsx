import { ScrollText } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/feedback/empty-state"
import { ContractTable } from "@/components/domain/franchise/ContractTable"
import type { ContractView } from "@/components/domain/franchise/mappers"
import { toContractStatus } from "@/components/domain/franchise/mappers"
import { listAgreements } from "@lib/server/services/agreements"
import { prisma } from "@/lib/prisma"

export default async function AgreementsPage() {
  const organizationId = (await prisma.organization.findFirst({ select: { id: true } }))?.id ?? ""
  if (!organizationId) {
    return (
      <EmptyState
        title="Sign in required"
        description="Sign in to view franchise agreements."
      />
    )
  }
  const ctx = { userId: "", organizationId, membershipRole: "OWNER" as const }

  const [agreements, organization] = await Promise.all([
    listAgreements(ctx),
    prisma.organization.findUnique({ where: { id: organizationId }, select: { currency: true } }),
  ])
  const currency = organization?.currency ?? "USD"
  const rows: ContractView[] = agreements.map((agreement) => ({
    id: agreement.id,
    agreementNo: agreement.agreementNo,
    franchiseName:
      agreement.franchisee.tradingName ?? agreement.franchisee.legalName,
    status: toContractStatus(agreement.status),
    effectiveFromIso: agreement.startDate.toISOString(),
    effectiveToIso: agreement.endDate?.toISOString() ?? null,
    royaltyRatePct: Number(agreement.royaltyRate),
    initialFeeCents: Math.round(Number(agreement.initialFee) * 100),
    currency,
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agreements"
        description={`${agreements.length} franchise agreements`}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Total", agreements.length],
          ["Active", agreements.filter((a) => a.status === "ACTIVE").length],
          ["Pending", agreements.filter((a) => a.status === "PENDING_SIGNATURE").length],
          ["Expired/Terminated", agreements.filter((a) => ["EXPIRED", "TERMINATED"].includes(a.status)).length],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-2xl p-4 glass">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
          </div>
        ))}
      </div>
      {agreements.length === 0 ? (
        <EmptyState
          title="No agreements yet"
          description="Franchise agreements will appear here."
          icon={<ScrollText className="size-5" />}
        />
      ) : (
        <ContractTable data={rows} />
      )}
    </div>
  )
}
