import { Bell } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/feedback/empty-state"

export default async function NotificationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" description="In-app alerts and operational updates." />
      <EmptyState
        title="Notifications unavailable"
        description="Notification records cannot be loaded until notification persistence is added."
        icon={<Bell className="size-5" />}
      />
    </div>
  )
}

