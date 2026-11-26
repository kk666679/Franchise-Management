/**
 * Product grid page — all products + filters for the tenant/territory.
 */
import { resolveTenant } from "@/lib/server/commerce/tenant"
import { ProductGridAdapter } from "@/components/commerce/adapters/ProductGridAdapter"

export default async function ProductsPage({
  params,
}: {
  params: { tenant: string }
}) {
  const ctx = await resolveTenant(params.tenant)

  return (
    <section className="px-4 py-8 sm:px-6">
      <h2 className="text-xl font-semibold tracking-tight mb-6">
        Products · {ctx.slug}
      </h2>
      <ProductGridAdapter
        tenantId={ctx.tenantId}
        territoryId={ctx.territoryId}
        products={[]}
      />
    </section>
  )
}
