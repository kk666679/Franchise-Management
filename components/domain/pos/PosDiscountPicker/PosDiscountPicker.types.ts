import type { PosDiscountView } from "../types"

export type PosDiscountPickerProps = {
  discounts: PosDiscountView[]
  onApplyCode: (code: string) => Promise<void> | void
  onRemove: (discountId: string) => void
  disabled?: boolean
}
