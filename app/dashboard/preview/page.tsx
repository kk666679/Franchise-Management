import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import {
  WebPreview,
  WebPreviewBody,
  WebPreviewConsole,
  WebPreviewNavigation,
  WebPreviewUrl,
} from "@/components/ai-elements/web-preview"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"

export default function ApplicationPreviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Application preview"
        description="Preview the implemented dashboard, finance, and POS workflows."
        actions={
          <Button asChild variant="outline">
            <Link href="/dashboard">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to dashboard
            </Link>
          </Button>
        }
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
