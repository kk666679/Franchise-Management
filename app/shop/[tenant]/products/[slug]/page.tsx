/**
 * Product detail page.
 *
 * Server component that fetches the product + variants for the territory.
 */
import { notFound } from "next/navigation"
import { resolveTenant } from "@/lib/server/commerce/tenant"
import { ProductDetailAdapter } from "@/components/commerce/adapters/ProductDetailAdapter"

export default async function ProductDetailPage({
  params,
}: {
  params: { tenant: string; slug: string }
}) {
  const ctx = await resolveTenant(params.tenant)

  // In v1 the product detail is a shell; data is populated by the adapter
  // calling the commerce catalog service server-side.
  return (
    <section className="px-4 py-8 sm:px-6">
      <ProductDetailAdapter
        tenantId={ctx.tenantId}
        territoryId={ctx.territoryId}
        slug={params.slug}
      />
    </section>
  )
}
