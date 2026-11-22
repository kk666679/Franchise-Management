import { NextResponse } from "next/server"

import { getCurrentSession } from "@lib/server/auth/session"
import { createSale } from "@lib/server/sales"

export async function POST(request: Request) {
  const session = await getCurrentSession()
  if (!session?.org) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const sale = await createSale(
      {
        userId: session.sub,
        organizationId: session.org,
        membershipRole: session.role ?? undefined,
      },
      session.org,
      body
    )

    return NextResponse.json(
      {
        ...sale,
        lines: sale.lines.map((line) => ({
          ...line,
          quantity: line.quantity.toString(),
          unitPrice: line.unitPrice.toString(),
          discount: line.discount.toString(),
          tax: line.tax.toString(),
          total: line.total.toString(),
        })),
        payments: sale.payments.map((payment) => ({
          ...payment,
          amount: payment.amount.toString(),
        })),
      },
      { status: 201 }
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create sale."
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
