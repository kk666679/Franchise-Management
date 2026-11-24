import type { MoneyCellProps } from "./MoneyCell.types"

export function MoneyCell({ cents, currency, className }: MoneyCellProps) {
  const value = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(cents / 100)
  return (
    <span className={["tabular-nums", className].filter(Boolean).join(" ")}>
      {value}
    </span>
  )
}
