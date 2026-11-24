import type { PosCartItemView } from "../mappers"

export type PosCartProps = {
  items: PosCartItemView[]
  onQtyChange: (id: string, qty: number) => void
  onRemove: (id: string) => void
}
