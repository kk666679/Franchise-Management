export function FormActions({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={["flex items-center justify-end gap-2", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  )
}
