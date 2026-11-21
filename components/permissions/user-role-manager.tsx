"use client"

import { useState } from "react"

import { RoleBadge } from "@/components/permissions/role-badge"
import { RoleSelector } from "@/components/permissions/role-selector"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { RoleCode } from "@/lib/rbac"

export type RoleManagedUser = { id: string; name: string; email: string; role: RoleCode }

export function UserRoleManager({ users, onSave, disabled = false }: { users: readonly RoleManagedUser[]; onSave: (userId: string, role: RoleCode) => void | Promise<void>; disabled?: boolean }) {
  const [drafts, setDrafts] = useState<Record<string, RoleCode>>(() => Object.fromEntries(users.map((user) => [user.id, user.role])))
  const [saving, setSaving] = useState<string | null>(null)

  async function save(user: RoleManagedUser) {
    const role = drafts[user.id] ?? user.role
    setSaving(user.id)
    try { await onSave(user.id, role) } finally { setSaving(null) }
  }

  return <Card>
    <CardHeader><CardTitle>Role assignments</CardTitle></CardHeader>
    <CardContent className="space-y-3">
      {users.length === 0 ? <p className="py-6 text-center text-sm text-muted-foreground">No users are available for role management.</p> : users.map((user) => <div className="flex flex-col gap-3 rounded-xl border border-border/70 p-3 sm:flex-row sm:items-center" key={user.id}>
        <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{user.name}</p><p className="truncate text-xs text-muted-foreground">{user.email}</p></div>
        <div className="flex items-center gap-2 sm:w-64"><RoleBadge role={drafts[user.id] ?? user.role} showIcon={false} /><RoleSelector className="min-w-0" includeEmpty={false} onChange={(role) => setDrafts((current) => ({ ...current, [user.id]: role }))} value={drafts[user.id] ?? user.role} /></div>
        <Button disabled={disabled || saving === user.id} onClick={() => void save(user)} size="sm">{saving === user.id ? "Saving…" : "Save"}</Button>
      </div>)}
    </CardContent>
  </Card>
}
