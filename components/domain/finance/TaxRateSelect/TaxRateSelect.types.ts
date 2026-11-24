import type { TaxRateView } from "../mappers"

export type TaxRateSelectProps = {
  rates: TaxRateView[]
  value: string | null
  onChange: (id: string | null) => void
  label?: string
}
