export function PermissionGate({
  children,
  key,
  permission,
}: {
  children?: React.ReactNode
  key?: string
  permission?: string
}) {
  return (
    <div className="flex items-center gap-2">
      {key && <span className="px-2 py-0.5 text-sm font-medium">{key}</span>}
      {permission ? <span className="text-red-600">{permission}</span> : null}
      {children}
    </div>
  )
}
