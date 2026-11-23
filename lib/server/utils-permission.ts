/**
 * Permission helper utilities.
 *
 * Re-exports the canonical permission checks from `lib/server/auth/authorization`
 * and `lib/rbac` for backward compatibility. Prefer importing directly from
 * `@/lib/server/auth/authorization` or `@/lib/rbac` in new code.
 */

export {
  assertAnyPermission,
  assertCanManageOrganization,
  assertCanReadOrganization,
  assertOrganizationAccess,
  assertPermission,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
  resolvePermissions,
  type AuthorizationContext,
} from "@/lib/server/auth/authorization"

export {
  getRoleDefinition,
  permissionIsGranted,
  permissionsForMembershipRole,
  type MembershipRole,
  type PermissionCode,
  type RoleCode,
} from "@/lib/rbac"
