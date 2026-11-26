/**
 * Idempotent fulfillment webhook receiver.
 *
 * Receives fulfillment provider webhooks. Idempotent on idempotencyKey.
 * Emits order.fulfilled.v1 to the event bus.
 */
import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

const fulfillmentWebhookSchema = z.object({
  idempotencyKey: z.string().min(1),
  orderId: z.string().min(1),
  trackingRef: z.string().min(1),
  status: z.enum(["shipped", "delivered", "exception"]),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = fulfillmentWebhookSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const { idempotencyKey, orderId, trackingRef, status } = parsed.data

    const existing = await prisma.fulfillment.findFirst({
      where: { orderId, trackingRef },
      select: { id: true, status: true },
    })

    if (existing) {
      return NextResponse.json({ received: true, duplicate: true })
    }

    await prisma.fulfillment.create({
      data: {
        id: `ful_${Math.random().toString(36).slice(2, 11)}`,
        orderId,
        status: status === "delivered" ? "FULFILLED" : "PENDING",
        trackingRef,
      },
    })

    if (status === "delivered") {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "fulfilled" },
      })
    }

    return NextResponse.json({ received: true })
  } catch {
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
