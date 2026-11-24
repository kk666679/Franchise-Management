import {
  WebPreview,
  WebPreviewBody,
  WebPreviewConsole,
  WebPreviewNavigation,
  WebPreviewUrl,
} from "@/components/ai-elements/web-preview"
import { AppShell } from "@/components/layout/app-shell"
import { PageContainer } from "@/components/layout/page-container"
import { PageHeader } from "@/components/layout/page-header"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { getCurrentSession } from "@lib/server/auth/session"
import { resolvePermissions } from "@lib/server/auth"
import { visibleDestinations } from "@/lib/navigation"

export default async function ApplicationPreviewPage() {
  const session = await getCurrentSession()

  return (
    <AppShell
      brand={<span className="text-sm font-semibold">Application preview</span>}
      sidebar={
        <DashboardNav
          items={visibleDestinations(
            resolvePermissions([], session?.role ?? undefined)
          )}
        />
      }
    >
      <PageContainer className="space-y-6">
        <PageHeader
          title="Application preview"
          description="Preview the implemented dashboard, finance, and POS workflows."
        />
        <div className="h-[calc(100vh-13rem)] min-h-[32rem]">
          <WebPreview defaultUrl="/dashboard/pos">
            <WebPreviewNavigation>
              <WebPreviewUrl aria-label="Application route" />
            </WebPreviewNavigation>
            <WebPreviewBody />
            <WebPreviewConsole>
              Preview routes are backed by the application APIs and database
              services.
            </WebPreviewConsole>
          </WebPreview>
        </div>
      </PageContainer>
    </AppShell>
  )
}
