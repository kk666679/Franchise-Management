import type { PosProductView } from "../mappers"

export type PosProductSearchProps = {
  products: PosProductView[]
  onSelect: (product: PosProductView) => void
}
