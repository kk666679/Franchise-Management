/**
 * Order confirmation page.
 *
 * Server component rendering order details for a confirmed order. Tenant-scoped
 * — a cross-tenant orderId returns 404 without leaking existence.
 */
import { notFound } from "next/navigation"
import { resolveTenant, setTenantContext } from "@/lib/server/commerce/tenant"

export default async function OrderConfirmationPage({
  params,
}: {
  params: { tenant: string; orderId: string }
}) {
  const ctx = await resolveTenant(params.tenant)
  await setTenantContext(ctx)

  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    select: {
      id: true,
      clientOpId: true,
      status: true,
      totalMinor: true,
      currency: true,
      createdAt: true,
    },
  })

  if (!order || order.tenantId !== ctx.tenantId) {
    notFound()
  }

  return (
    <section className="px-4 py-12 sm:px-6">
      <h1 className="text-xl font-semibold tracking-tight">Order confirmed</h1>
      <p className="mt-3 text-muted-foreground">
        Order <span className="font-mono">{order.id}</span> —{" "}
        {(order.totalMinor / 100).toFixed(2)} {order.currency}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Status: {order.status}
      </p>
    </section>
  )
}
