/**
 * Commerce shop root layout.
 *
 * Wraps the customer-facing storefront in CommerceProviders (tenant context +
 * commerce UI providers). This is the commerce plane boundary — control-plane
 * components are never imported here.
 */
import { CommerceProviders } from "@/components/commerce/providers/CommerceProviders"

export const metadata = {
  title: "Storefront",
  description: "Franchisee storefront — catalog, cart, checkout.",
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <CommerceProviders>{children}</CommerceProviders>
}
