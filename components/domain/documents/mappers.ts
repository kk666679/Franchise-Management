export type DocumentView = {
  id: string
  name: string
  category: string
  version: number
  updatedAtIso: string
  updatedBy: string
  sizeBytes: number
}

export type DocumentVersionView = {
  id: string
  version: number
  createdAtIso: string
  createdBy: string
  note: string | null
}
