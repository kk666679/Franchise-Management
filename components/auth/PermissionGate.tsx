"use client"

import * as React from "react"

export type PermissionGateProps = {
  children: React.ReactNode
  permission?: string | string[]
  fallback?: React.ReactNode
  /**
   * Temporary compatibility prop. Do not use for new code.
   * `key` is reserved by React and cannot be passed through JSX props.
   */
  label?: string
}

/**
 * Client UI visibility gate only. Do NOT use for security enforcement.
 * Protected routes/actions must be authorized server-side.
 */
export function PermissionGate({
  children,
  permission,
  fallback = null,
  label,
}: PermissionGateProps) {
  // Stub migration: real permission evaluation requires a permission context/provider.
  // We keep children visible to avoid accidental lockout while surfacing explicit API.
  void permission
  void label
  return <>{children ?? fallback}</>
}
