import { describe, it, expect } from "vitest"
import {
  ROLES,
  PERMISSIONS,
  PERMISSION_CATALOG,
  DEFAULT_ROLE_PERMISSIONS,
  MEMBERSHIP_ROLES,
  MEMBERSHIP_ROLE_PERMISSIONS,
  permissionIsGranted,
  permissionsForMembershipRole,
} from "@/lib/rbac"

describe("RBAC Catalog", () => {
  it("should have 13 role codes", () => {
    expect(ROLES).toHaveLength(13)
  })

  it("should expose permission catalog", () => {
    expect(PERMISSION_CATALOG.length).toBeGreaterThan(0)
    expect(Object.keys(PERMISSIONS).length).toBe(PERMISSION_CATALOG.length)
  })

  it("should have 5 membership roles", () => {
    expect(MEMBERSHIP_ROLES).toHaveLength(5)
  })

  it("SUPER_ADMIN should have all permissions", () => {
    const all = PERMISSION_CATALOG.map((p) => p.code)
    expect(DEFAULT_ROLE_PERMISSIONS.SUPER_ADMIN).toEqual(all)
  })

  it("OWNER should have all permissions", () => {
    const all = PERMISSION_CATALOG.map((p) => p.code)
    expect(MEMBERSHIP_ROLE_PERMISSIONS.OWNER).toEqual(all)
  })

  it("VIEWER should have read-only permissions", () => {
    const permissions = MEMBERSHIP_ROLE_PERMISSIONS.VIEWER
    expect(permissions).toContain(PERMISSIONS.ORG_READ)
    expect(permissions).not.toContain(PERMISSIONS.ORG_WRITE)
  })

  it("should grant OWNER permissions", () => {
    expect(
      permissionIsGranted(
        MEMBERSHIP_ROLE_PERMISSIONS.OWNER,
        PERMISSIONS.ORG_READ
      )
    ).toBe(true)
  })

  it("should deny missing STAFF permissions", () => {
    expect(
      permissionIsGranted(
        MEMBERSHIP_ROLE_PERMISSIONS.STAFF,
        PERMISSIONS.ORG_WRITE
      )
    ).toBe(false)
  })

  it("should check ADMIN permissions", () => {
    expect(
      permissionIsGranted(
        MEMBERSHIP_ROLE_PERMISSIONS.ADMIN,
        PERMISSIONS.ORG_WRITE
      )
    ).toBe(true)
  })

  it("should resolve ADMIN membership permissions", () => {
    const resolved = permissionsForMembershipRole("ADMIN")
    expect(resolved.has(PERMISSIONS.ORG_READ)).toBe(true)
    expect(resolved.has(PERMISSIONS.ORG_WRITE)).toBe(true)
  })
})
