/**
 * Checkout page.
 *
 * Server component that renders the checkout form shell. Order placement is
 * handled by checkout/actions.ts (placeOrder) which is atomic and idempotent.
 */
import { resolveTenant } from "@/lib/server/commerce/tenant"
import { CheckoutAdapter } from "@/components/commerce/adapters/CheckoutAdapter"

export default async function CheckoutPage({
  params,
}: {
  params: { tenant: string }
}) {
  const ctx = await resolveTenant(params.tenant)

  return (
    <section className="px-4 py-8 sm:px-6 max-w-3xl">
      <h2 className="text-xl font-semibold tracking-tight mb-6">
        Checkout · {ctx.slug}
      </h2>
      <CheckoutAdapter
        tenantId={ctx.tenantId}
        territoryId={ctx.territoryId}
      />
    </section>
  )
}
