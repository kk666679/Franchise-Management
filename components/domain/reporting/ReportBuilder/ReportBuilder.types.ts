import type { ReportColumnView, ReportFilterView } from "../mappers"

export type ReportBuilderProps = {
  columns: ReportColumnView[]
  filters: ReportFilterView[]
  onColumnsChange: (cols: ReportColumnView[]) => void
  onFiltersChange: (filters: ReportFilterView[]) => void
  onRun: () => void
}
