/**
 * Tenant-scoped layout.
 *
 * Resolves the tenant slug server-side into CommerceTenantContext and sets
 * PostgreSQL RLS session variables for all downstream queries.
 */
import { notFound } from "next/navigation"
import { resolveTenant, setTenantContext, clearTenantContext } from "@/lib/server/commerce/tenant"

export async function generateMetadata({ params }: { params: { tenant: string } }) {
  try {
    const ctx = await resolveTenant(params.tenant)
    return { title: ctx.slug, description: `${ctx.slug} storefront` }
  } catch {
    return { title: "Storefront" }
  }
}

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { tenant: string }
}) {
  let ctx
  try {
    ctx = await resolveTenant(params.tenant)
    await setTenantContext(ctx)
  } catch {
    notFound()
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      {children}
    </div>
  )
}
