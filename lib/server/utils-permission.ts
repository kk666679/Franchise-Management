import type { MembershipRole } from "@/lib/rbac"
import { hasPermission, MEMBERSHIP_ROLE_PERMISSIONS, permissionIsGranted, type PermissionCode } from "@/lib/rbac"

/** Check if a user has the required permission.
 *  Grants when: `granted.has(required)` or `granted.includes(required)`.
 *  Returns `true` when the permission is found in the granted set; `false` otherwise.
 */

/** Convenience: check a membership role's granted set for a permission. */
export function permissionForMembershipRole(role: MembershipRole, required: PermissionCode): boolean {
  return hasPermission(MEMBERSHIP_ROLE_PERMISSIONS[role], required)
}

/** Check multiple permissions at once. */
export function hasAnyPermission(
  granted: readonly PermissionCode[] | ReadonlySet<PermissionCode>,
  required: PermissionCode[],
): boolean {
  return required.every((req) => hasPermission(granted, req))
}

/** Check that *all* required permissions are granted. */
export function hasAllPermissions(
  granted: readonly PermissionCode[] | ReadonlySet<PermissionCode>,
  required: PermissionCode[],
): boolean {
  return required.every((req) => hasPermission(granted, req))
}