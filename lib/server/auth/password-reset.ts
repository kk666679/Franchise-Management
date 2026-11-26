import { createHash, randomBytes } from "node:crypto"

import { prisma } from "@/lib/prisma"
import { env } from "@/lib/env"
import { hashPassword } from "@lib/server/auth/password"

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex")
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

export async function issuePasswordResetToken(userId: string) {
  if (!env.RESEND_API_KEY) throw new Error("Password reset email is not configured.")
  const token = randomBytes(32).toString("base64url")
  const expiresAt = new Date(Date.now() + env.MAGIC_LINK_TTL_MINUTES * 60_000)

  await prisma.passwordResetToken.deleteMany({
    where: {
      userId,
      OR: [{ consumedAt: { not: null } }, { expiresAt: { lt: new Date() } }],
    },
  })
  await prisma.passwordResetToken.create({
    data: { userId, tokenHash: hashToken(token), expiresAt },
  })

  return {
    token,
    expiresAt,
    url: `${env.APP_URL}/auth/password-reset/verify?token=${encodeURIComponent(token)}`,
  }
}

export async function sendPasswordResetEmail(input: {
  to: string
  name?: string | null
  url: string
  expiresAt: Date
}) {
  if (!env.RESEND_API_KEY) throw new Error("Password reset email is not configured.")
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: [input.to],
      subject: "Reset your password",
      html: `<p>Hello ${escapeHtml(input.name ?? "there")},</p><p><a href="${escapeHtml(input.url)}">Reset your password</a></p><p>This link expires at ${input.expiresAt.toISOString()} and can only be used once.</p>`,
    }),
  })

  if (!response.ok) {
    throw new Error("Unable to deliver the password reset email.")
  }
}

export async function consumePasswordResetToken(input: {
  token: string
  newPassword: string
}) {
  const token = input.token?.trim()
  if (!token) return { ok: false as const, reason: "invalid" as const }

  const passwordHash = await hashPassword(input.newPassword)

  return prisma.$transaction(async (tx) => {
    const record = await tx.passwordResetToken.findUnique({
      where: { tokenHash: hashToken(token) },
      select: { id: true, userId: true, consumedAt: true, expiresAt: true },
    })

    if (!record || record.consumedAt || record.expiresAt <= new Date()) {
      return { ok: false as const, reason: "invalid" as const }
    }

    await tx.passwordResetToken.update({
      where: { id: record.id },
      data: { consumedAt: new Date() },
    })
    await tx.passwordResetToken.updateMany({
      where: { userId: record.userId, consumedAt: null, id: { not: record.id } },
      data: { consumedAt: new Date() },
    })
    await tx.magicLinkToken.updateMany({
      where: { userId: record.userId, consumedAt: null },
      data: { consumedAt: new Date() },
    })
    await tx.user.update({
      where: { id: record.userId },
      data: { passwordHash, passwordChangedAt: new Date() },
    })

    return { ok: true as const }
  })
}
