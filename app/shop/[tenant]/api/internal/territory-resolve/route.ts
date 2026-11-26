/**
 * Internal territory → payment account lookup.
 *
 * Server-to-server endpoint (not public). Used by payment routing to resolve
 * which Stripe Connect account receives funds for a territory.
 */
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const territoryId = searchParams.get("territoryId")

  if (!territoryId) {
    return NextResponse.json({ error: "territoryId required" }, { status: 400 })
  }

  const territory = await prisma.territory.findUnique({
    where: { id: territoryId },
    select: {
      id: true,
      franchiseId: true,
      paymentAccountId: true,
    },
  })

  if (!territory) {
    return NextResponse.json({ error: "Territory not found" }, { status: 404 })
  }

  return NextResponse.json({
    territoryId: territory.id,
    franchiseId: territory.franchiseId,
    paymentAccountId: territory.paymentAccountId,
  })
}
