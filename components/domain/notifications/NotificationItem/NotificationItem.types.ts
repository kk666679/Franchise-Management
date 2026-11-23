import type { NotificationView } from '../mappers'

export type NotificationItemProps = { notification: NotificationView; onMarkRead?: (id: string) => void }
