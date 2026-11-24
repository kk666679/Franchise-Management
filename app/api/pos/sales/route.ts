import { NextResponse } from "next/server"

import { getCurrentSession } from "@lib/server/auth/session"
import { createSale } from "@lib/server/sales"

export async function POST(request: Request) {
  const session = await getCurrentSession()
  if (!session?.org) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const input = body as {
    receiptNo?: string
    idempotencyKey?: string
    lines?: Array<{ productId: string; quantity: number; discount?: number }>
    payments?: Array<{ method: "CASH" | "CARD" | "BANK_TRANSFER" | "DIRECT_DEBIT" | "OTHER"; amount: string | number; reference?: string }>
  }

  if (!input.receiptNo || !input.idempotencyKey || !Array.isArray(input.lines) || !Array.isArray(input.payments)) {
    return NextResponse.json({ error: "receiptNo, idempotencyKey, lines, and payments are required." }, { status: 400 })
  }

  try {
    const sale = await createSale(
      {
        userId: session.sub,
        organizationId: session.org,
        membershipRole: session.role ?? undefined,
      },
      session.org,
      {
        receiptNo: input.receiptNo,
        idempotencyKey: input.idempotencyKey,
        lines: input.lines,
        payments: input.payments,
      }
    )
    return NextResponse.json({ sale }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create sale."
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
