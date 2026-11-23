export function Section({ title, description, actions, className }: { title?: string; description?: string; actions?: ReactNode; className?: string }) {
  return (
    <section className={cn("flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", className)}>
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      {description ? <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p> : null}
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </section>
  )
}
