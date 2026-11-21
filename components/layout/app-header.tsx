"use client"

import { Bell, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { type FormEvent, useState } from "react"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function AppHeader({ title = "Workspace" }: { title?: string }) {
  const router = useRouter()
  const [query, setQuery] = useState("")

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = query.trim()
    if (value) router.push(`/dashboard?search=${encodeURIComponent(value)}`)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/75 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1600px] items-center gap-3 pl-12 lg:pl-0">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{title}</p>
        </div>
        <form className="hidden w-full max-w-sm md:block" onSubmit={submit} role="search">
          <label className="sr-only" htmlFor="global-search">Search workspace</label>
          <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" id="global-search" onChange={(event) => setQuery(event.target.value)} placeholder="Search workspace" value={query} />
          </div>
        </form>
        <Button aria-label="Notifications" size="icon" variant="ghost"><Bell /></Button>
        <ThemeToggle />
      </div>
    </header>
  )
}
