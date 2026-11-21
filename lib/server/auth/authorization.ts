import {
  DEFAULT_ROLE_PERMISSIONS,
  MEMBERSHIP_ROLE_PERMISSIONS,
  PERMISSIONS,
  type MembershipRole,
  type PermissionCode,
  type RoleCode,
} from "@/lib/rbac"

export type AuthorizationContext = {
  userId: string
  organizationId: string
  roles?: readonly RoleCode[]
  membershipRole?: MembershipRole
  permissions?: readonly PermissionCode[]
}

export class AuthorizationError extends Error {
  readonly code = "FORBIDDEN"

  constructor(message = "You do not have permission to perform this action.") {
    super(message)
    this.name = "AuthorizationError"
  }
}

export class TenantAccessError extends Error {
  readonly code = "TENANT_ACCESS_DENIED"

  constructor(message = "You cannot access resources outside your organization.") {
    super(message)
    this.name = "TenantAccessError"
  }
}

/** Resolves the effective permission set from persisted and functional roles. */
export function resolvePermissions(
  roles: readonly RoleCode[] = [],
  membershipRole?: MembershipRole,
  explicitPermissions: readonly PermissionCode[] = [],
): ReadonlySet<PermissionCode> {
  const granted = new Set<PermissionCode>(explicitPermissions)

  for (const role of roles) {
    for (const permission of DEFAULT_ROLE_PERMISSIONS[role]) {
      granted.add(permission)
    }
  }

  if (membershipRole) {
    for (const permission of MEMBERSHIP_ROLE_PERMISSIONS[membershipRole]) {
      granted.add(permission)
    }
  }

  return granted
}

export function hasPermission(
  context: AuthorizationContext,
  required: PermissionCode,
): boolean {
  return resolvePermissions(
    context.roles,
    context.membershipRole,
    context.permissions,
  ).has(required)
}

export function hasAnyPermission(
  context: AuthorizationContext,
  required: readonly PermissionCode[],
): boolean {
  const granted = resolvePermissions(
    context.roles,
    context.membershipRole,
    context.permissions,
  )

  return required.some((permission) => granted.has(permission))
}

export function hasAllPermissions(
  context: AuthorizationContext,
  required: readonly PermissionCode[],
): boolean {
  const granted = resolvePermissions(
    context.roles,
    context.membershipRole,
    context.permissions,
  )

  return required.every((permission) => granted.has(permission))
}

export function assertPermission(
  context: AuthorizationContext,
  required: PermissionCode,
): void {
  if (!hasPermission(context, required)) {
    throw new AuthorizationError(
      `Missing permission: ${required}`,
    )
  }
}

export function assertAnyPermission(
  context: AuthorizationContext,
  required: readonly PermissionCode[],
): void {
  if (!hasAnyPermission(context, required)) {
    throw new AuthorizationError(
      `At least one permission is required: ${required.join(", ")}`,
    )
  }
}

/** Checks the tenant before any resource query or mutation is performed. */
export function assertOrganizationAccess(
  context: AuthorizationContext,
  organizationId: string,
): void {
  if (context.organizationId !== organizationId) {
    throw new TenantAccessError()
  }
}

/**
 * Standard guard for organization-scoped mutations.
 * Keep this before repository calls so tenant isolation is enforced server-side.
 */
export function assertCanManageOrganization(
  context: AuthorizationContext,
  organizationId: string,
): void {
  assertOrganizationAccess(context, organizationId)
  assertPermission(context, PERMISSIONS.ORG_WRITE)
}

export function assertCanReadOrganization(
  context: AuthorizationContext,
  organizationId: string,
): void {
  assertOrganizationAccess(context, organizationId)
  assertPermission(context, PERMISSIONS.ORG_READ)
}
