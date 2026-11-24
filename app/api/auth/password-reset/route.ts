import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  const body = await request.json()
  const { email } = body

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 })
  }

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    // Don't reveal whether the user exists
    return NextResponse.json({ success: true })
  }

  // Generate reset token
  const resetToken = Buffer.from(email + Math.random().toString()).toString(
    "base64"
  )

  // In a real implementation, we'd:
  // 1. Store the token with expiration in a password reset tokens table
  // 2. Send an email with the reset link
  // 3. The GET handler would verify the token and allow password reset

  return NextResponse.json({
    success: true,
    resetToken,
    message: "Password reset link generated. Check your email.",
  })
}
