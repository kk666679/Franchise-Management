import { NextResponse } from "next/server"

import { consumeMagicLink } from "@lib/server/auth/magic-link"
import {
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@lib/server/auth/session"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const user = await consumeMagicLink(url.searchParams.get("token") ?? "")
  if (!user)
    return NextResponse.redirect(
      new URL("/login?error=invalid-link", request.url)
    )

  const membership = user.memberships[0]
  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    org: membership?.organizationId ?? null,
    role: membership?.role ?? null,
  })
  const response = NextResponse.redirect(new URL("/dashboard", request.url))
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions())
  return response
}
