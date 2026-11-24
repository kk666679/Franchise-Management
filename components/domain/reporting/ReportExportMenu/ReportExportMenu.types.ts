export type ReportExportFormat = "csv" | "xlsx" | "pdf"
export type ReportExportMenuProps = {
  onExport: (format: ReportExportFormat) => void
}
