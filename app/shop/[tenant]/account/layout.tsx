/**
 * Account layout — requires authenticated customer session within the tenant.
 */
import { resolveTenant } from "@/lib/server/commerce/tenant"

export default async function AccountLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { tenant: string }
}) {
  const ctx = await resolveTenant(params.tenant)

  return (
    <section className="px-4 py-8 sm:px-6 max-w-4xl">
      <h2 className="text-xl font-semibold tracking-tight mb-6">
        Account · {ctx.slug}
      </h2>
      {children}
    </section>
  )
}
