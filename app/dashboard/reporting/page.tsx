import { FileBarChart2 } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/feedback/empty-state"

export default function ReportingPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Reporting" description="Operational and financial reports, exports, and scheduled deliveries." />
      <EmptyState
        title="Reporting unavailable"
        description="Saved report definitions and scheduled deliveries cannot be loaded until reporting persistence is added."
        icon={<FileBarChart2 className="size-5" />}
      />
    </div>
  )
}

