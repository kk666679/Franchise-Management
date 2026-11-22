import { createHash, randomBytes } from "node:crypto"

import { prisma } from "@/lib/prisma"
import { env } from "@/lib/env"

export class MagicLinkConfigurationError extends Error {
  constructor() {
    super("Magic-link email delivery is not configured.")
    this.name = "MagicLinkConfigurationError"
  }
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex")
}

export function assertMagicLinkConfigured() {
  if (!env.RESEND_API_KEY) throw new MagicLinkConfigurationError()
}

export async function issueMagicLink(userId: string) {
  assertMagicLinkConfigured()
  const token = randomBytes(32).toString("base64url")
  const expiresAt = new Date(Date.now() + env.MAGIC_LINK_TTL_MINUTES * 60_000)

  await prisma.magicLinkToken.deleteMany({
    where: {
      userId,
      OR: [{ consumedAt: { not: null } }, { expiresAt: { lt: new Date() } }],
    },
  })
  await prisma.magicLinkToken.create({
    data: { userId, tokenHash: hashToken(token), expiresAt },
  })

  return {
    token,
    expiresAt,
    url: `${env.APP_URL}/auth/magic-link/verify?token=${encodeURIComponent(token)}`,
  }
}

export async function sendMagicLinkEmail(input: {
  to: string
  name?: string | null
  url: string
  expiresAt: Date
}) {
  assertMagicLinkConfigured()
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: [input.to],
      subject: "Your secure sign-in link",
      html: `<p>Hello ${escapeHtml(input.name ?? "there")},</p><p><a href="${escapeHtml(input.url)}">Sign in to Franchise Management</a></p><p>This link expires at ${input.expiresAt.toISOString()} and can only be used once.</p>`,
    }),
  })

  if (!response.ok) {
    throw new Error("Unable to deliver the magic link email.")
  }
}

export async function consumeMagicLink(token: string) {
  if (!token) return null

  return prisma.$transaction(async (tx) => {
    const record = await tx.magicLinkToken.findUnique({
      where: { tokenHash: hashToken(token) },
      include: {
        user: {
          include: { memberships: { orderBy: { createdAt: "asc" }, take: 1 } },
        },
      },
    })
    if (!record || record.consumedAt || record.expiresAt <= new Date())
      return null

    await tx.magicLinkToken.update({
      where: { id: record.id },
      data: { consumedAt: new Date() },
    })
    await tx.user.update({
      where: { id: record.userId },
      data: { status: "ACTIVE", lastLoginAt: new Date() },
    })

    return record.user
  })
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character] ?? character
  )
}
