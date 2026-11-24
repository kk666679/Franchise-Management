import { ScanBarcode } from "lucide-react"

import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { AppShell } from "@/components/layout/app-shell"
import { PageContainer } from "@/components/layout/page-container"
import { PageHeader } from "@/components/layout/page-header"
import { POSTerminal } from "@/components/pos/pos-terminal"
import { resolvePermissions } from "@lib/server/auth"
import { getCurrentSession } from "@lib/server/auth/session"
import { visibleDestinations } from "@/lib/navigation"

export default async function POSPage() {
  const session = await getCurrentSession()

  return (
    <AppShell
      brand={
        <span className="flex items-center gap-2 text-sm font-semibold">
          <ScanBarcode className="size-4 text-primary" />
          Point of sale
        </span>
      }
      sidebar={
        <DashboardNav
          items={visibleDestinations(
            resolvePermissions([], session?.role ?? undefined)
          )}
        />
      }
    >
      <PageContainer className="space-y-6">
        <PageHeader
          title="Point of sale"
          description="Process sales, split payments, and print receipts."
        />
        <POSTerminal />
      </PageContainer>
    </AppShell>
  )
}
