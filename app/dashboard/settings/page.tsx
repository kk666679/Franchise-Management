import { Settings } from "lucide-react"

import { AppShell } from "@/components/layout/app-shell"
import { PageContainer } from "@/components/layout/page-container"
import { PageHeader } from "@/components/layout/page-header"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { PermissionMatrix } from "@/components/permissions/permission-matrix"
import { RoleBadge } from "@/components/permissions/role-badge"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCurrentSession } from "@lib/server/auth/session"
import { resolvePermissions, assertPermission } from "@lib/server/auth"
import { visibleDestinations } from "@/lib/navigation"
import { PERMISSIONS, MEMBERSHIP_ROLE_PERMISSIONS, MEMBERSHIP_ROLES } from "@/lib/rbac"
import { prisma } from "@/lib/prisma"
import { listAuditLogs } from "@lib/server/services/franchise"
import { PageAccessNotice } from "@/components/auth/page-access-notice"

const dateFmt = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})

const ROLE_CODE_MAP = {
  OWNER: "SUPER_ADMIN",
  ADMIN: "GROUP_ADMIN",
  MANAGER: "AREA_MANAGER",
  STAFF: "EMPLOYEE",
  VIEWER: "AUDITOR",
} as const

export default async function SettingsPage() {
  const session = await getCurrentSession()
  if (!session?.org) {
    return (
      <PageAccessNotice
        title="Settings"
        description="This settings page is open to everyone. Sign in to view organization members, roles, and audit records."
      />
    )
  }
  const ctx = {
    userId: session.sub,
    organizationId: session.org,
    membershipRole: session.role ?? undefined,
  }
  assertPermission(ctx, PERMISSIONS.SETTINGS_MANAGE)

  const [org, members, auditLogs] = await Promise.all([
    prisma.organization.findUnique({
      where: { id: session.org },
      select: { id: true, name: true, slug: true, timezone: true, currency: true, createdAt: true },
    }),
    prisma.membership.findMany({
      where: { organizationId: session.org },
      include: { user: { select: { id: true, name: true, email: true, status: true } } },
      orderBy: { createdAt: "asc" },
    }),
    listAuditLogs(ctx, 30),
  ])

  const granted = resolvePermissions([], session?.role ?? undefined)
  const navigation = visibleDestinations(granted)

  return (
    <AppShell
      brand={
        <span className="flex items-center gap-2 text-sm font-semibold">
          <Settings className="size-4 text-primary" />
          Franchise Management
        </span>
      }
      sidebar={<DashboardNav items={navigation} />}
    >
      <PageContainer className="space-y-6">
        <PageHeader title="Settings" description="Organization, members, permissions and audit history" />

        <Tabs defaultValue="organization">
          <TabsList className="glass rounded-xl">
            <TabsTrigger value="organization">Organization</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="audit">Audit log</TabsTrigger>
          </TabsList>

          <TabsContent value="organization" className="mt-6">
            <div className="glass rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold">Organization details</h2>
              <dl className="grid gap-3 sm:grid-cols-2 text-sm">
                {(
                  [
                    ["Name", org?.name],
                    ["Slug", org?.slug],
                    ["Timezone", org?.timezone],
                    ["Currency", org?.currency],
                    ["Created", org?.createdAt ? dateFmt.format(org.createdAt) : "—"],
                  ] as [string, string | undefined][]
                ).map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="mt-0.5 font-medium">{v ?? "—"}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </TabsContent>

          <TabsContent value="members" className="mt-6">
            <div className="overflow-hidden rounded-2xl border border-border bg-card/60">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Member</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <p className="font-medium">{m.user.name ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">{m.user.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary">{m.role}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{m.user.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="mt-6 space-y-6">
            {MEMBERSHIP_ROLES.map((role) => (
              <div key={role} className="space-y-3">
                <div className="flex items-center gap-2">
                  <RoleBadge role={ROLE_CODE_MAP[role]} />
                  <span className="text-sm text-muted-foreground">{role}</span>
                </div>
                <PermissionMatrix selected={MEMBERSHIP_ROLE_PERMISSIONS[role]} readOnly />
              </div>
            ))}
          </TabsContent>

          <TabsContent value="audit" className="mt-6">
            <div className="overflow-hidden rounded-2xl border border-border bg-card/60">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[40rem] text-left text-sm">
                  <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">When</th>
                      <th className="px-4 py-3 font-medium">Actor</th>
                      <th className="px-4 py-3 font-medium">Action</th>
                      <th className="px-4 py-3 font-medium">Entity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/70">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                          {dateFmt.format(log.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-xs">
                          {log.actor?.name ?? log.actor?.email ?? "System"}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className="text-xs">{log.action}</Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {log.entity}{" "}
                          <span className="font-mono">{log.entityId.slice(0, 8)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </AppShell>
  )
}

