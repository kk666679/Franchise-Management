import type { ReactNode } from "react"

import { permissionIsGranted, type PermissionCode } from "@/lib/rbac"

export function PermissionGuard({ permissions, require: required, fallback = null, children }: { permissions: ReadonlySet<PermissionCode> | readonly PermissionCode[]; require: PermissionCode | readonly PermissionCode[]; fallback?: ReactNode; children: ReactNode }) {
  const requiredPermissions = Array.isArray(required) ? required : [required]
  const allowed = requiredPermissions.every((permission) => permissionIsGranted(permissions, permission))
  return allowed ? children : fallback
}
