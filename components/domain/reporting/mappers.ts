export type ReportColumnView = { id: string; label: string; selected: boolean }
export type ReportFilterView = { id: string; field: string; operator: string; value: string }
export type ScheduledReportView = { id: string; name: string; cadence: 'daily' | 'weekly' | 'monthly'; recipients: string[]; lastRunIso: string | null; enabled: boolean }
