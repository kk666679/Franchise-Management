import { NextResponse } from "next/server"

import { getCurrentSession } from "@lib/server/auth/session"
import { createRefund } from "@lib/server/sales"

export async function POST(request: Request) {
  const session = await getCurrentSession()
  if (!session?.org) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    )
  }

  try {
    const refund = await createRefund(
      {
        userId: session.sub,
        organizationId: session.org,
        membershipRole: session.role ?? undefined,
      },
      session.org,
      await request.json()
    )
    return NextResponse.json(
      { ...refund, amount: refund.amount.toString() },
      { status: 201 }
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create refund."
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
