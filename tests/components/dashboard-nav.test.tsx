import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { navigationDestinations } from "@/lib/navigation"

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
    render(<DashboardNav items={navigationDestinations} />)
    const overview = screen.getByRole("link", { name: /overview/i })
    expect(overview).toHaveAttribute("href", "/dashboard")
  })

  it("does not render planned destinations as links (no dead 404s)", () => {
    render(<DashboardNav items={navigationDestinations} />)
    expect(screen.queryByRole("link", { name: /finance/i })).toBeNull()
  })

  it("marks planned destinations as unavailable", () => {
    render(<DashboardNav items={navigationDestinations} />)
    const finance = screen.getByTitle(/finance is not available yet/i)
    expect(finance).toHaveAttribute("aria-disabled", "true")
  })

  it("labels planned destinations with a Soon badge", () => {
    render(<DashboardNav items={navigationDestinations} />)
    expect(screen.getAllByText(/soon/i).length).toBeGreaterThan(0)
  })
})
