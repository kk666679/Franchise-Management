import type { PosProductView } from "../types"

export type PosProductSearchProps = {
  products: PosProductView[]
  onSelect: (product: PosProductView) => void
  disabled?: boolean
}
