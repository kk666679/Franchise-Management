import { streamText } from "ai"
import { cookies } from "next/headers"
import { NextRequest } from "next/server"

import { getCurrentSession } from "@lib/server/auth/session"
import { resolvePermissions } from "@lib/server/auth"
import { PERMISSIONS } from "@/lib/rbac"
import { env } from "@/lib/env"

// AI provider is optional — route returns 503 when no provider is configured.
async function getModel() {
  if (!env.AI_DEFAULT_MODEL) return null
  try {
    // Dynamic import so the build doesn't fail when no provider key is set
    const { gateway } = await import("ai")
    return gateway(env.AI_DEFAULT_MODEL)
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  const session = await getCurrentSession()
  if (!session?.org) {
    return new Response("Unauthorized", { status: 401 })
  }

  const granted = resolvePermissions([], session.role ?? undefined)
  if (!granted.has(PERMISSIONS.AI_ASSISTANT_USE)) {
    return new Response("Forbidden", { status: 403 })
  }

  const model = await getModel()
  if (!model) {
    return new Response(
      "AI provider not configured. Set AI_DEFAULT_MODEL and OPENAI_API_KEY in your environment.",
      { status: 503 },
    )
  }

  const { messages } = await req.json()

  const result = streamText({
    model,
    system: `You are the Franchise Intelligence Assistant for organization ${session.org}.
You help franchise managers understand their network performance, compliance, agreements and financials.
You only discuss information relevant to franchise management.
You never approve applications, authorize payments, change permissions or sign agreements — those require human authorization.
Always distinguish between verified business records and your own analysis or recommendations.`,
    messages,
    maxOutputTokens: 1024,
  })

  return result.toTextStreamResponse()
}
