import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const token = url.searchParams.get("token")
  const dest = new URL("/login", request.url)
  if (token) {
    dest.searchParams.set("resetToken", token)
  } else {
    dest.searchParams.set("error", "invalid-reset-link")
  }
  return NextResponse.redirect(dest)
}