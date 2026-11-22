"use server"

import { randomUUID } from "node:crypto"

import { prisma } from "@/lib/prisma"
import {
  assertMagicLinkConfigured,
  issueMagicLink,
  sendMagicLinkEmail,
} from "@lib/server/auth/magic-link"

export type SignupState = {
  status: "idle" | "error" | "success"
  message: string
}

export async function signupAction(
  _previousState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase()

  if (name.length < 2)
    return { status: "error", message: "Enter your full name." }
  if (!email || !email.includes("@"))
    return { status: "error", message: "Enter a valid work email." }
  try {
    assertMagicLinkConfigured()
  } catch {
    return {
      status: "error",
      message: "Magic-link email is not configured yet.",
    }
  }

  try {
    let user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      const slug = `${email.split("@")[0].replace(/[^a-z0-9]+/g, "-")}-${randomUUID().slice(0, 8)}`
      user = await prisma.user.create({
        data: {
          email,
          name,
          status: "INVITED",
          memberships: {
            create: {
              role: "OWNER",
              organization: {
                create: {
                  name: `${name}'s organization`,
                  slug,
                },
              },
            },
          },
        },
      })
    }

    const link = await issueMagicLink(user.id)
    await sendMagicLinkEmail({
      to: user.email,
      name: user.name ?? name,
      url: link.url,
      expiresAt: link.expiresAt,
    })

    return {
      status: "success",
      message: "Check your email for a secure link to finish signing up.",
    }
  } catch {
    return {
      status: "error",
      message: "Magic-link email is not configured yet.",
    }
  }
}
