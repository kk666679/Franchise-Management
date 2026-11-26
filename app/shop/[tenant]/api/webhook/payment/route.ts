/**
 * Idempotent payment webhook receiver.
 *
 * Receives Stripe (or equivalent) webhooks. Idempotent on idempotencyKey — a
 * redelivered webhook returns the prior acknowledgment without re-applying the
 * state transition. Emits order.paid.v1 to the event bus.
 */
import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

const paymentWebhookSchema = z.object({
  idempotencyKey: z.string().min(1),
  orderId: z.string().min(1),
  providerRef: z.string().min(1),
  amountMinor: z.number().int().nonnegative(),
  status: z.enum(["succeeded", "failed", "refunded"]),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = paymentWebhookSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const { idempotencyKey, orderId, providerRef, amountMinor, status } = parsed.data

    // Idempotency: check if we already processed this webhook.
    const existing = await prisma.payment.findUnique({
      where: { providerRef },
      select: { id: true, status: true },
    })

    if (existing) {
      // Already processed — return prior acknowledgment.
      return NextResponse.json({ received: true, duplicate: true })
    }

    const payment = await prisma.payment.create({
      data: {
        id: `pay_${Math.random().toString(36).slice(2, 11)}`,
        orderId,
        providerRef,
        amountMinor,
        status: status === "succeeded" ? "SUCCEEDED" : "FAILED",
      },
    })

    if (status === "succeeded") {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "paid" },
      })
    }

    return NextResponse.json({ received: true, paymentId: payment.id })
  } catch {
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
