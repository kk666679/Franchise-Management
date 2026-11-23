import type { ReportFilterView } from '../mappers'

export type ReportFilterPanelProps = { filters: ReportFilterView[]; onChange: (filters: ReportFilterView[]) => void }
