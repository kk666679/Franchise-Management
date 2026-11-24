import { PageHeader } from "@/components/layout/page-header"
import { PosWorkspace } from "@/components/domain/pos"
import { prisma } from "@/lib/prisma"

export default async function POSPage() {
  const organization = await prisma.organization.findFirst({
    select: { id: true, currency: true },
  })

  const products = organization
    ? await prisma.product.findMany({
        where: { organizationId: organization.id, active: true },
        orderBy: { name: "asc" },
        take: 100,
        select: { id: true, name: true, sku: true, unitPrice: true },
      })
    : []

  const currency = organization?.currency ?? "USD"

  return (
    <div className="space-y-6">
      <PageHeader
        title="Point of sale"
        description="Process sales, manage register sessions, and issue receipts."
      />
      <PosWorkspace
        currency={currency}
        products={products.map((p) => ({
          id: p.id,
          name: p.name,
          sku: p.sku,
          priceCents: Math.round(Number(p.unitPrice) * 100),
          currency,
          inStock: 99,
        }))}
      />
    </div>
  )
}
