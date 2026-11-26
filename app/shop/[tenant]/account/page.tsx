/**
 * Account overview page.
 */
export default function AccountOverviewPage() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border p-4 bg-muted/50">
        <h3 className="text-sm font-semibold">Recent orders</h3>
        <p className="mt-1 text-sm text-muted-foreground">Order history coming soon.</p>
      </div>
      <div className="rounded-xl border p-4 bg-muted/50">
        <h3 className="text-sm font-semibold">Account details</h3>
        <p className="mt-1 text-sm text-muted-foreground">Profile coming soon.</p>
      </div>
    </div>
  )
}
