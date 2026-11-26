/**
 * Category listing page.
 *
 * Lists products filtered by category within the tenant's territory.
 */
import { resolveTenant } from "@/lib/server/commerce/tenant"
import { ProductGridAdapter } from "@/components/commerce/adapters/ProductGridAdapter"
import { notFound } from "next/navigation"

export default async function CategoryPage({
  params,
}: {
  params: { tenant: string; slug: string[] }
}) {
  const ctx = await resolveTenant(params.tenant)

  // Category resolution would query the commerce catalog scoped to territory.
  const categorySlug = params.slug.join("/")
  if (!categorySlug) {
    notFound()
  }

  return (
    <section className="px-4 py-8 sm:px-6">
      <h2 className="text-xl font-semibold tracking-tight mb-6">
        Category: {categorySlug}
      </h2>
      <ProductGridAdapter
        tenantId={ctx.tenantId}
        territoryId={ctx.territoryId}
        categorySlug={categorySlug}
        products={[]}
      />
    </section>
  )
}
