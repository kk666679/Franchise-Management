import { NextResponse } from "next/server"

import { getCurrentSession } from "@lib/server/auth/session"
import { searchProducts } from "@lib/server/sales"

export async function GET(request: Request) {
  const session = await getCurrentSession()
  if (!session?.org) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    )
  }

  const query = new URL(request.url).searchParams.get("q") ?? ""
  const products = await searchProducts(
    {
      userId: session.sub,
      organizationId: session.org,
      membershipRole: session.role ?? undefined,
    },
    session.org,
    query
  )

    return NextResponse.json(
        products.map((product) => ({
          ...product,
          unitPrice: product.unitPrice.toString(),
          costPrice: product.costPrice.toString(),
          taxRate: product.taxRate.toString(),
        }))
    )
}
