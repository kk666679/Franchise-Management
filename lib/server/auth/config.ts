import type { MembershipRole } from "@/lib/rbac"
import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

import { prisma } from "@/lib/prisma"
import { MEMBERSHIP_ROLES, MEMBERSHIP_ROLE_PERMISSIONS } from "@/lib/rbac"

import type { AuthOptions } from "next-auth"

async function getUserByCredentials(email: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return null

  const membership = await prisma.membership.findFirst({
    where: { userId: user.id },
  })

  if (!membership) return { user, role: "EMPLOYEE" as const }

  return { user, role: (membership.role as MembershipRole) }
}

async function getUserByMagicLink(email: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return null

  const membership = await prisma.membership.findFirst({
    where: { userId: user.id },
  })

  return { user, role: (membership?.role as MembershipRole) || "EMPLOYEE" }
}

// ──────────────────────────────────────────────────────────────────────
// next-auth module augmentation — add `role` + `organizationId` to `session.user`
// ──────────────────────────────────────────────────────────────────────

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string | null
      email: string | null
      role: MembershipRole | "EMPLOYEE"
      organizationId?: string
    }
    expires: string
  }
  interface User {
    id: string
    name?: string | null
    email?: string | null
    role?: MembershipRole | "EMPLOYEE"
    organizationId?: string
  }
}

// ──────────────────────────────────────────────────────────────────────
// JWT payload — carried through session refresh
// ──────────────────────────────────────────────────────────────────────

interface JWT {
  id: string
  name?: string
  email?: string
  role?: MembershipRole | "EMPLOYEE"
  organizationId?: string
}

// ──────────────────────────────────────────────────────────────────────
// Callbacks: populate `session.user.role` from MembershipRole
// ──────────────────────────────────────────────────────────────────────

const callbacks = {
  async session({ session, token }) {
    session.user.role = token.role as MembershipRole | "EMPLOYEE"
    session.user.organizationId = token.organizationId as string | undefined
    return session
  },
  async jwt({ user, token }) {
    if (user) {
      const role: MembershipRole | "EMPLOYEE" = (user as any).role ?? "EMPLOYEE"
      const orgId = (user as any).organizationId
      return { id: user.id, name: user.name, email: user.email, role, organizationId: orgId }
    }
    return token
  },
} satisfies AuthOptions["callbacks"]

// ──────────────────────────────────────────────────────────────────────
// Providers: credentials (email/password) + optional OAuth
// ──────────────────────────────────────────────────────────────────────

const providers = [
  CredentialsProvider({
    id: "credentials",
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email", placeholder: "user@example.com" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const user = await getUserByCredentials(credentials!.email)

      if (!user || !user.user) return null

      // Placeholder password check: accept any hash starting with $2b$ (seed bcrypt format)
      const passwordOk = user.user.passwordHash?.startsWith("$2b$")

      if (!passwordOk) return null

      return {
        id: user.user.id,
        name: user.user.name,
        email: user.user.email,
        role: user.role,
        organizationId: (user as { organizationId?: string }).organizationId ?? undefined,
      }
    },
  }),

  // OAuth providers (optional; can be enabled when desired)
  GitHubProvider({
    clientId: process.env.GITHUB_ID ?? "",
    clientSecret: process.env.GITHUB_SECRET ?? "",
  } as any),

  GoogleProvider({
    clientId: process.env.GOOGLE_ID ?? "",
    clientSecret: process.env.GOOGLE_SECRET ?? "",
  } as any),
] satisfies AuthOptions["providers"]

// ──────────────────────────────────────────────────────────────────────
// Next-auth configuration
// ──────────────────────────────────────────────────────────────────────

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  callbacks,
  providers,
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,
}

// ──────────────────────────────────────────────────────────────────────
// Export helpful types + helpers for consumers of this module
// ──────────────────────────────────────────────────────────────────────

import { hasPermission, permissionIsGranted, type PermissionCode } from "@/lib/rbac"


export { hasPermission, permissionIsGranted }
export type { PermissionCode }

export default authOptions