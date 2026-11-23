import type { DocumentView } from '../mappers'

export type DocumentLinkPickerProps = { documents: DocumentView[]; value: string | null; onChange: (id: string | null) => void }
