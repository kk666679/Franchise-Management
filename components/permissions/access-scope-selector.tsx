import { ROLE_DEFINITIONS, type RoleScope } from "@/lib/rbac"

const SCOPES: readonly RoleScope[] = ["PLATFORM", "GROUP", "BRAND", "REGION", "AREA", "FRANCHISE", "BRANCH", "ORGANIZATION"]

export function AccessScopeSelector({ value, onChange, disabled = false, className }: { value: RoleScope; onChange: (scope: RoleScope) => void; disabled?: boolean; className?: string }) {
  return <select
    aria-label="Select access scope"
    className={`h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring ${className ?? ""}`}
    disabled={disabled}
    onChange={(event) => onChange(event.target.value as RoleScope)}
    value={value}
  >
    {SCOPES.map((scope) => <option key={scope} value={scope}>{scope.charAt(0) + scope.slice(1).toLowerCase()} scope</option>)}
  </select>
}

export function roleScopeLabel(role: keyof typeof ROLE_DEFINITIONS) {
  return ROLE_DEFINITIONS[role].scope
}
