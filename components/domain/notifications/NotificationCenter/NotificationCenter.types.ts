import type { NotificationView } from "../mappers"

export type NotificationCenterProps = {
  notifications: NotificationView[]
  onMarkRead?: (id: string) => void
}
