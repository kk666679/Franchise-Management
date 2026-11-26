import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { issueMagicLink, sendMagicLinkEmail } from "@lib/server/auth/magic-link"

const GENERIC_SUCCESS = {
  success: true,
  message:
    "If an account exists for that email, a secure sign-in link has been sent.",
} as const

export async function GET(request: Request) {
  const url = new URL(request.url)
  const token = url.searchParams.get("token")
  const verifyUrl = new URL("/auth/magic-link/verify", request.url)
  if (token) verifyUrl.searchParams.set("token", token)
  return NextResponse.redirect(verifyUrl)
}

export async function POST(request: Request) {
  let email = ""
  try {
    const body = (await request.json()) as { email?: unknown }
    email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
  } catch {
    return NextResponse.json(GENERIC_SUCCESS)
  }

  if (!email || !email.includes("@")) {
    return NextResponse.json(GENERIC_SUCCESS)
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true },
    })
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
    // Return generic success to avoid leaking configuration or account state.
  }

  return NextResponse.json(GENERIC_SUCCESS)
}
