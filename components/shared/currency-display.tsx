export function CurrencyDisplay({ value, currency = "USD", className }: { value: number; currency?: string; className?: string }) {
  const formatted = new Intl.NumberFormat("en", { currency, style: "currency", maximumFractionDigits: 2 }).format(value)
  return <span className={className}>{formatted}</span>
}
