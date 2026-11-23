export type NotificationView = {
  id: string
  title: string
  body: string
  read: boolean
  createdAtIso: string
  kind: 'info' | 'warning' | 'action'
}

export type NotificationPreferenceView = {
  channel: 'email' | 'sms' | 'push' | 'in_app'
  enabled: boolean
}
