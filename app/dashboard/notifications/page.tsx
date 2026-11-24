import { Bell } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/feedback/empty-state"
import { NotificationCenter } from "@/components/domain/notifications/NotificationCenter"
import type { NotificationView } from "@/components/domain/notifications/mappers"
import { prisma } from "@/lib/prisma"

export default async function NotificationsPage() {
  const organizationId = (await prisma.organization.findFirst({ select: { id: true } }))?.id ?? ""
  

  // No Notification Prisma model yet; render domain component with empty data.
  const notifications: NotificationView[] = []

  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" description="In-app alerts and operational updates." />
      {notifications.length === 0 ? (
        <EmptyState
          title="No notifications"
          description="Notification domain components are integrated. Notification persistence is not present in Prisma yet; this page will populate when notification models are added."
          icon={<Bell className="size-5" />}
        />
      ) : (
        <NotificationCenter notifications={notifications} />
      )}
    </div>
  )
}

