import type { NotificationPreferenceView } from '../mappers'

export type NotificationPreferencesFormProps = { initial: NotificationPreferenceView[]; onSave: (prefs: NotificationPreferenceView[]) => Promise<void> }
