"use server"

import { cookies } from "next/headers"

import { prisma } from "@/lib/prisma"
import {
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@lib/server/auth/session"
import { verifyPassword } from "@lib/server/auth/password"
import { issueMagicLink, sendMagicLinkEmail } from "@lib/server/auth/magic-link"

export type LoginState = {
  status: "idle" | "error" | "success" | "magic-link-sent"
  message: string
}

export async function magicLinkAction(
  _previousState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase()
  if (!email || !email.includes("@")) {
    return { status: "error", message: "Enter a valid work email." }
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (user) {
      const link = await issueMagicLink(user.id)
      await sendMagicLinkEmail({
        to: user.email,
        name: user.name,
        url: link.url,
        expiresAt: link.expiresAt,
      })
    }
  } catch {
    return {
      status: "error",
      message: "Magic-link email is not configured yet.",
    }
  }

  return {
    status: "magic-link-sent",
    message:
      "If an account exists for that email, a secure sign-in link has been sent.",
  }
}

const INVALID_CREDENTIALS = "Invalid email or password."

export async function loginAction(
  _previousState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase()
  const password = String(formData.get("password") ?? "")

  if (!email || !email.includes("@") || !password) {
    return { status: "error", message: INVALID_CREDENTIALS }
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      memberships: {
        orderBy: { createdAt: "asc" },
        take: 1,
      },
    },
  })

  if (!user || user.status !== "ACTIVE" || !user.passwordHash) {
    return { status: "error", message: INVALID_CREDENTIALS }
  }

  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) return { status: "error", message: INVALID_CREDENTIALS }

  const membership = user.memberships[0]
  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    org: membership?.organizationId ?? null,
    role: membership?.role ?? null,
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, sessionCookieOptions())

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  })

  return { status: "success", message: "Signed in successfully." }
}
