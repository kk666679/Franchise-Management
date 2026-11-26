import { NextResponse } from "next/server"

import { consumePasswordResetToken } from "@lib/server/auth/password-reset"

export async function POST(request: Request) {
  let token = ""
  let newPassword = ""
  try {
    const body = (await request.json()) as {
      token?: unknown
      newPassword?: unknown
    }
    token = typeof body.token === "string" ? body.token : ""
    newPassword = typeof body.newPassword === "string" ? body.newPassword : ""
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request." },
      { status: 400 }
    )
  }

  if (!token || !newPassword) {
    return NextResponse.json(
      { success: false, message: "Token and new password are required." },
      { status: 400 }
    )
  }

  const result = await consumePasswordResetToken({ token, newPassword })
  if (!result.ok) {
    return NextResponse.json(
      { success: false, message: "Invalid or expired reset link." },
      { status: 400 }
    )
  }

  return NextResponse.json({
    success: true,
    message: "Password has been reset. Sign in with your new password.",
  })
}