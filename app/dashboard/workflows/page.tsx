import { Workflow } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/feedback/empty-state"

export default function WorkflowsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Workflows & approvals" description="Approval queues, decision trails, and workflow status." />
      <EmptyState
        title="Approvals unavailable"
        description="Approval records cannot be loaded until workflow persistence and reviewer-confirmed decision handling are implemented."
        icon={<Workflow className="size-5" />}
      />
    </div>
  )
}

