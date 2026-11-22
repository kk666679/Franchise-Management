import Link from "next/link"

import { Button } from "@/components/ui/button"

export function PageAccessNotice({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-12">
      <section className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/login">Sign in to view this page</Link>
        </Button>
      </section>
    </main>
  )
}
