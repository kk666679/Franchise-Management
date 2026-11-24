import type { PosProductView, PosCartItemView } from "../mappers"

export type PosTerminalProps = {
  products: PosProductView[]
  cart: PosCartItemView[]
  onAdd: (product: PosProductView) => void
  onQtyChange: (id: string, qty: number) => void
  onRemove: (id: string) => void
  onTender: (method: "cash" | "card") => Promise<void>
  disabled?: boolean
  tenderDisabled?: boolean
}
