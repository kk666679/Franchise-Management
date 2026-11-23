import type { NextAuthOptions, Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

import { prisma } from "@/lib/prisma"
import { permissionIsGranted, type MembershipRole, type PermissionCode } from "@/lib/rbac"
import { hasPermission } from "@/lib/server/auth/authorization"

type SessionUser = {
  id: string
  name: string | null
  email: string | null
  role: MembershipRole | "EMPLOYEE"
  organizationId?: string
}

declare module "next-auth" {
  interface Session {
    user: SessionUser
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    role?: MembershipRole | "EMPLOYEE"
    organizationId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: MembershipRole | "EMPLOYEE"
    organizationId?: string
  }
}

async function getUserByCredentials(email: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return null

  const membership = await prisma.membership.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  })

  return {
    user,
    role: (membership?.role ?? "EMPLOYEE") as MembershipRole | "EMPLOYEE",
    organizationId: membership?.organizationId,
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email
        if (!email) return null

        const result = await getUserByCredentials(email)
        if (!result) return null

        const passwordOk = result.user.passwordHash?.startsWith("$2b$")
        if (!passwordOk) return null

        return {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.role,
          organizationId: result.organizationId,
        }
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.role = user.role ?? "EMPLOYEE"
        token.organizationId = user.organizationId
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = (token.id ?? token.sub ?? "") as string
        session.user.name = (token.name ?? session.user.name ?? null) as string | null
        session.user.email = (token.email ?? session.user.email ?? null) as string | null
        session.user.role = (token.role ?? "EMPLOYEE") as MembershipRole | "EMPLOYEE"
        session.user.organizationId = token.organizationId
      }
      return session
    },
  },
}

export async function getUserByMagicLink(email: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return null

  const membership = await prisma.membership.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  })

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: (membership?.role ?? "EMPLOYEE") as MembershipRole | "EMPLOYEE",
    organizationId: membership?.organizationId,
  }
}

export type { MembershipRole, PermissionCode }
export { hasPermission, permissionIsGranted }

export default authOptions