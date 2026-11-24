import { ROLE_DEFINITIONS, ROLES, type RoleCode } from "@/lib/rbac"

export type RoleSelectorProps = {
  value: RoleCode | ""
  onChange: (role: RoleCode) => void
  disabled?: boolean
  includeEmpty?: boolean
  id?: string
  name?: string
  className?: string
}

export function RoleSelector({
  value,
  onChange,
  disabled,
  includeEmpty = true,
  id,
  name = "role",
  className,
}: RoleSelectorProps) {
  return (
    <select
      aria-label="Select role"
      className={`h-9 w-full rounded-lg border border-input bg-background px-3 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring ${className ?? ""}`}
      disabled={disabled}
      id={id}
      name={name}
      onChange={(event) => {
        const selected = event.target.value as RoleCode
        if (selected) onChange(selected)
      }}
      value={value}
    >
      {includeEmpty ? <option value="">Select a role</option> : null}
      {ROLES.map((role) => (
        <option key={role} value={role}>
          {ROLE_DEFINITIONS[role].name}
        </option>
      ))}
    </select>
  )
}
