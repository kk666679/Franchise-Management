import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { navigationDestinations } from "@/lib/navigation"

function navFor(hrefs: string[]) {
  return navigationDestinations.filter((d) => hrefs.includes(d.href))
}

// next/link requires the App Router context; render a plain anchor in tests.
vi.mock("next/link", () => ({
  default: (props: Record<string, unknown>) => <a {...props} />,
}))

// Vitest globals are disabled, so React Testing Library cannot auto-register
// its cleanup hook. Unmount between tests to keep the DOM isolated.
afterEach(() => {
  cleanup()
})

describe("DashboardNav", () => {
  it("renders live destinations as links", () => {
    render(<DashboardNav items={navFor(["/dashboard"])} />)
    const overview = screen.getByRole("link", { name: /overview/i })
    expect(overview).toHaveAttribute("href", "/dashboard")
  })

  it("does not render planned destinations as links (no dead 404s)", () => {
    const planned = navigationDestinations.map((d) =>
      d.href === "/dashboard/finance" ? { ...d, status: "planned" as const } : d
    )
    render(<DashboardNav items={planned} />)
    expect(screen.queryByRole("link", { name: /^finance$/i })).toBeNull()
  })

  it("marks planned destinations as unavailable", () => {
    const planned = navFor(["/dashboard"]).map((d) =>
      d.href === "/dashboard" ? { ...d, status: "planned" as const, label: "Overview" } : d
    )
    render(<DashboardNav items={planned} />)
    const item = screen.getByTitle(/overview is not available yet/i)
    expect(item).toHaveAttribute("aria-disabled", "true")
  })

  it("labels planned destinations with a Soon badge", () => {
    const planned = navFor(["/dashboard"]).map((d) => ({
      ...d,
      status: "planned" as const,
    }))
    render(<DashboardNav items={planned} />)
    expect(screen.getAllByText(/soon/i).length).toBeGreaterThan(0)
  })
})
