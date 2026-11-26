/**
 * Storefront home page.
 *
 * Server component: resolves tenant context and renders the storefront hero.
 */
import { resolveTenant } from "@/lib/server/commerce/tenant"
import { StorefrontHero } from "@/components/commerce/ui/storefront-hero-1"

export default async function TenantHomePage({
  params,
}: {
  params: { tenant: string }
}) {
  const ctx = await resolveTenant(params.tenant)

  return (
    <section className="px-4 py-12 sm:px-6 lg:py-24">
      <StorefrontHero
        tenant={ctx.slug}
        currency={ctx.currency}
        territoryId={ctx.territoryId}
      />
    </section>
  )
}
