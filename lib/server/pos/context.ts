import { getCurrentSession } from "@lib/server/auth/session";
import type { AuthorizationContext } from "@lib/server/auth";
import { prisma } from "@/lib/prisma";

export async function requirePosContext(): Promise<AuthorizationContext> {
  const session = await getCurrentSession();
  if (session?.org) {
    return {
      userId: session.sub,
      organizationId: session.org,
      membershipRole: session.role ?? undefined,
    };
  }
  if (process.env.NODE_ENV !== "production") {
    const org = await prisma.organization.findFirst({ select: { id: true } });
    if (org) return { userId: "dev-user", organizationId: org.id, membershipRole: "OWNER" as any };
  }
  throw new Error("Authentication required.");
}
