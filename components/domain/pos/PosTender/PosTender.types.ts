import type { PosCartItemView, PosTenderType } from "../types"

export type PosTenderProps = {
  items: PosCartItemView[]
  onTender: (method: "cash" | "card") => Promise<void> | void
  disabled?: boolean
  methods?: PosTenderType[]
}
