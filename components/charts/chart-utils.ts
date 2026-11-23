export function formatCurrency(value: number): string {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatPercentage(value: number): string {
  return `${value}%`
}

export function formatNumber(value: number): string {
  return value.toFixed(2)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toISOString().split("T")[0]
}
