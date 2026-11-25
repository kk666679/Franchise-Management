import { prisma } from "@/lib/prisma"
import { visibleDestinations } from "@/lib/navigation"
import { resolvePermissions } from "@lib/server/auth"

export async function getDashboardContext(required?: string | undefined) {
  const organizationId =
    (await prisma.organization.findFirst({ select: { id: true } }))?.id ?? ""
  if (!organizationId) return null
  const ctx = {
    userId: "",
    organizationId,
    membershipRole: "OWNER" as const,
  }
  const granted = resolvePermissions([], "OWNER")
  return {
    session: null,
    ctx,
    granted,
    navigation: visibleDestinations(granted),
  }
}

export type DashboardContext = NonNullable<
  Awaited<ReturnType<typeof getDashboardContext>>
>
