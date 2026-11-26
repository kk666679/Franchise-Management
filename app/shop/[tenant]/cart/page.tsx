/**
 * Full cart page.
 *
 * Server component that renders the cart shell; cart state is managed by the
 * CartAdapter client component which syncs with server actions.
 */
import { resolveTenant } from "@/lib/server/commerce/tenant"
import { CartAdapter } from "@/components/commerce/adapters/CartAdapter"

export default async function CartPage({
  params,
}: {
  params: { tenant: string }
}) {
  const ctx = await resolveTenant(params.tenant)

  return (
    <section className="px-4 py-8 sm:px-6">
      <h2 className="text-xl font-semibold tracking-tight mb-6">
        Cart · {ctx.slug}
      </h2>
      <CartAdapter
        tenantId={ctx.tenantId}
        territoryId={ctx.territoryId}
      />
    </section>
  )
}
