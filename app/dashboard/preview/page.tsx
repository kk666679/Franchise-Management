import {
  WebPreview,
  WebPreviewBody,
  WebPreviewConsole,
  WebPreviewNavigation,
  WebPreviewUrl,
} from "@/components/ai-elements/web-preview"
import { PageHeader } from "@/components/layout/page-header"
import { prisma } from "@/lib/prisma"

export default async function ApplicationPreviewPage() {
  const organizationId = (await prisma.organization.findFirst({ select: { id: true } }))?.id ?? ""

  return (
    <div className="space-y-6">
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
    </div>
  )
}
