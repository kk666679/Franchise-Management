import { describe, expect, it } from "vitest"

import { navigationDestinations, visibleDestinations } from "@/lib/navigation"
import { PERMISSIONS, type PermissionCode } from "@/lib/rbac"

describe("visibleDestinations", () => {
  it("always includes destinations with no permission requirement", () => {
    const visible = visibleDestinations(new Set<PermissionCode>())
    expect(visible.some((d) => d.href === "/dashboard")).toBe(true)
  })

  it("hides a destination when its permission is not granted", () => {
    const visible = visibleDestinations(new Set<PermissionCode>())
    expect(visible.some((d) => d.href === "/dashboard/finance")).toBe(false)
  })

  it("shows a destination once its permission is granted", () => {
    const visible = visibleDestinations(
      new Set<PermissionCode>([PERMISSIONS.FINANCE_READ])
    )
    expect(visible.some((d) => d.href === "/dashboard/finance")).toBe(true)
  })

  it("never leaks a destination the role cannot access", () => {
    const visible = visibleDestinations(
      new Set<PermissionCode>([PERMISSIONS.FRANCHISE_READ])
    )
    const hrefs = visible.map((d) => d.href)
    expect(hrefs).toContain("/dashboard/franchises")
    expect(hrefs).not.toContain("/dashboard/finance")
    expect(hrefs).not.toContain("/dashboard/settings")
  })
})

describe("navigationDestinations contract", () => {
  it("marks unbuilt routes as planned so they render disabled, not as dead links", () => {
    const finance = navigationDestinations.find(
      (d) => d.href === "/dashboard/finance"
    )
    expect(finance?.status).toBe("planned")
  })

  it("has exactly one live route (the built overview)", () => {
    const live = navigationDestinations.filter((d) => d.status === "live")
    expect(live).toHaveLength(1)
    expect(live[0]?.href).toBe("/dashboard")
  })
})
