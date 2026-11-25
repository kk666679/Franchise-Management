import type { PosTableView } from "../types"

export type PosTableMapProps = {
  tables: PosTableView[]
  selectedTableId?: string | null
  onSelect: (tableId: string) => void
}
