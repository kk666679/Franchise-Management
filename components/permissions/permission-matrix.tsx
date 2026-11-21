"use client"

import { useMemo } from "react"

import { PERMISSION_CATALOG, type PermissionCode } from "@/lib/rbac"
import { Checkbox } from "@/components/ui/checkbox"

export function PermissionMatrix({ selected, onChange, readOnly = false }: { selected: ReadonlySet<PermissionCode> | readonly PermissionCode[]; onChange?: (permissions: ReadonlySet<PermissionCode>) => void; readOnly?: boolean }) {
  const selectedSet = useMemo(() => new Set(selected), [selected])
  const groups = useMemo(() => PERMISSION_CATALOG.reduce<Record<string, typeof PERMISSION_CATALOG>>((result, permission) => {
    const group = result[permission.category] ?? []
    group.push(permission)
    result[permission.category] = group
    return result
  }, {}), [])

  function toggle(permission: PermissionCode) {
    if (readOnly || !onChange) return
    const next = new Set(selectedSet)
    if (next.has(permission)) next.delete(permission)
    else next.add(permission)
    onChange(next)
  }

  return <div className="overflow-hidden rounded-2xl border border-border bg-card/60">
    {Object.entries(groups).map(([category, permissions]) => <section className="border-b border-border last:border-b-0" key={category}>
      <div className="bg-muted/40 px-4 py-3"><h3 className="text-sm font-semibold">{category}</h3></div>
      <div className="divide-y divide-border/60">
        {permissions.map((permission) => <label className="flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/20" key={permission.code}>
          <Checkbox checked={selectedSet.has(permission.code)} disabled={readOnly} onCheckedChange={() => toggle(permission.code)} />
          <span className="min-w-0"><span className="block text-sm font-medium">{permission.name}</span><span className="block text-xs text-muted-foreground">{permission.description}</span></span>
        </label>)}
      </div>
    </section>)}
  </div>
}
