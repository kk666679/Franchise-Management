import type { PosCartModifierView } from "../types"

export type PosModifierOption = PosCartModifierView & { selected?: boolean }

export type PosModifierPickerProps = {
  itemName: string
  options: PosModifierOption[]
  onChange: (selectedIds: string[]) => void
  disabled?: boolean
}
