import type { ReportColumnView } from "../mappers"

export type ReportColumnPickerProps = {
  columns: ReportColumnView[]
  onChange: (cols: ReportColumnView[]) => void
}
