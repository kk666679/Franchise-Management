import { notFound } from "next/navigation"
import { Mail, Phone } from "lucide-react"

import {
  BranchTable,
  ContractTable,
  FranchiseDetail,
  toBranchView,
  toContractView,
  toFranchiseView,
} from "@/components/domain/franchise"
import { CurrencyDisplay } from "@/components/shared/currency-display"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getFranchisee } from "@lib/server/services/franchise"
import { prisma } from "@/lib/prisma"
import { NotFoundError } from "@lib/server/errors"
import { FranchiseAISuggestions } from "../_components/franchise-ai-suggestions"

const dateFmt = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

export default async function FranchiseeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const organizationId = (await prisma.organization.findFirst({ select: { id: true } }))?.id ?? ""
  
  const ctx = {
    userId: "",
    organizationId: organizationId,
    membershipRole: "OWNER" as const,
  }

  let franchisee
  try {
    franchisee = await getFranchisee(ctx, id)
  } catch (e) {
    if (e instanceof NotFoundError) notFound()
    throw e
  }

  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { currency: true },
  })
  const currency = org?.currency ?? "USD"
  const franchiseView = toFranchiseView({
    id: franchisee.id,
    tradingName: franchisee.tradingName,
    legalName: franchisee.legalName,
    status: franchisee.status,
    brand: franchisee.brand,
    territory: null,
    locations: franchisee.locations.map(({ id }) => ({ id })),
    createdAt: franchisee.createdAt,
  })
  const branchViews = franchisee.locations.map((location) =>
    toBranchView({
      id: location.id,
      name: location.name,
      code: location.code,
      brandName: franchisee.brand?.name ?? null,
      franchiseName: franchisee.tradingName ?? franchisee.legalName,
      addressLine: location.addressLine1,
      city: location.city,
      region: location.state,
      status: location.status,
    })
  )
  const contractViews = franchisee.agreements.map((agreement) =>
    toContractView({
      id: agreement.id,
      agreementNo: agreement.agreementNo,
      franchiseName: franchiseView.name,
      status: agreement.status,
      startDate: agreement.startDate,
      endDate: agreement.endDate,
      royaltyRate: Number(agreement.royaltyRate),
      initialFeeCents: Math.round(Number(agreement.initialFee) * 100),
      currency,
    })
  )

  return (
    <div className="space-y-6">
      <FranchiseDetail franchise={franchiseView} />
      <FranchiseAISuggestions context="franchisee" />

        {/* Summary strip */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(
            [
              ["Brand", franchisee.brand?.name ?? "—"],
              ["Locations", String(franchisee.locations.length)],
              ["Agreements", String(franchisee.agreements.length)],
              ["Invoices", String(franchisee.invoices.length)],
            ] as [string, string][]
          ).map(([label, value]) => (
            <div key={label} className="rounded-2xl p-4 glass">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="mt-1 text-xl font-semibold">{value}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="rounded-xl glass">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="agreements">Agreements</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent
            value="overview"
            className="mt-6 grid gap-6 lg:grid-cols-2"
          >
            <div className="space-y-4 rounded-2xl p-6 glass">
              <h2 className="font-semibold">Contact details</h2>
              <dl className="space-y-3 text-sm">
                {franchisee.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 shrink-0 text-muted-foreground" />
                    <a
                      href={`mailto:${franchisee.email}`}
                      className="hover:text-primary"
                    >
                      {franchisee.email}
                    </a>
                  </div>
                )}
                {franchisee.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 shrink-0 text-muted-foreground" />
                    <span>{franchisee.phone}</span>
                  </div>
                )}
                {franchisee.registrationNo && (
                  <div>
                    <dt className="text-xs text-muted-foreground">
                      Registration No.
                    </dt>
                    <dd className="mt-0.5 font-mono">
                      {franchisee.registrationNo}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="space-y-4 rounded-2xl p-6 glass">
              <h2 className="font-semibold">Key contacts</h2>
              {franchisee.contacts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No contacts recorded.
                </p>
              ) : (
                <ul className="space-y-3">
                  {franchisee.contacts.map((c) => (
                    <li
                      key={c.id}
                      className="flex items-start justify-between gap-2 text-sm"
                    >
                      <div>
                        <p className="font-medium">{c.name}</p>
                        {c.title && (
                          <p className="text-xs text-muted-foreground">
                            {c.title}
                          </p>
                        )}
                        {c.email && (
                          <p className="text-xs text-muted-foreground">
                            {c.email}
                          </p>
                        )}
                      </div>
                      {c.isPrimary && (
                        <Badge variant="secondary" className="text-xs">
                          Primary
                        </Badge>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </TabsContent>

          {/* Locations */}
          <TabsContent value="locations" className="mt-6">
            <BranchTable data={branchViews} />
          </TabsContent>

          {/* Agreements */}
          <TabsContent value="agreements" className="mt-6">
            <ContractTable data={contractViews} />
          </TabsContent>

          {/* Invoices */}
          <TabsContent value="invoices" className="mt-6">
            {franchisee.invoices.length === 0 ? (
              <p className="text-sm text-muted-foreground">No invoices.</p>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-border bg-card/60">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase">
                    <tr>
                      <th className="px-4 py-3 font-medium">Invoice</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 text-right font-medium">
                        Total
                      </th>
                      <th className="px-4 py-3 text-right font-medium">Paid</th>
                      <th className="px-4 py-3 font-medium">Due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/70">
                    {franchisee.invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 font-mono text-xs">
                          {inv.invoiceNo}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className="text-xs">
                            {inv.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          <CurrencyDisplay
                            value={Number(inv.total)}
                            currency={currency}
                          />
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          <CurrencyDisplay
                            value={Number(inv.amountPaid)}
                            currency={currency}
                          />
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {dateFmt.format(inv.dueDate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
    </div>
  )
}
