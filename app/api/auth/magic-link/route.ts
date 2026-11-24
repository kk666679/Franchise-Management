import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserByMagicLink } from "@/lib/server/auth/config"
import { logLogin } from "@/lib/server/audit/logger"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 })
  }

  // Verify the magic link token and find the user
  // In a real implementation, we'd verify a signed token
  // For now, we look up by email from a magic link table
  const user = await getUserByMagicLink(token ? `magiclink-${token}` : "")

  if (!user) {
    return NextResponse.json(
      { error: "Invalid or expired magic link" },
      { status: 400 }
    )
  }

  // Log the login event
  await logLogin({
    organizationId: user.organizationId ?? "",
    actorId: user.id,
    ipAddress: request.headers.get("x-forwarded-for") || undefined,
    userAgent: request.headers.get("user-agent") || undefined,
  })

  // Create session
  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { email } = body

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 })
  }

  // Generate magic link token
  const token = Buffer.from(email + Math.random().toString()).toString("base64")

  // In a real implementation, we'd:
  // 1. Store the token with an expiration in a magic links table
  // 2. Send an email with the magic link URL
  // 3. The GET handler above verifies the token and logs in the user

  return NextResponse.json({
    success: true,
    token,
    message: "Magic link generated. Check your email.",
  })
}
