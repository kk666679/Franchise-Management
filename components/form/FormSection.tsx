export function FormSection({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={className}>
      {title ? <h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3> : null}
      <div className="space-y-4">{children}</div>
    </section>
  )
}
