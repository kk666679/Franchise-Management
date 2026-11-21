import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Page() {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden p-4 sm:p-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,transparent_0%,oklch(0.06_0.01_270/35%)_100%)]" />
      <div className="glass w-full max-w-2xl rounded-3xl p-5 sm:rounded-[2rem] sm:p-8 lg:p-12">
        <div className="flex flex-col-reverse items-start justify-between gap-8 sm:flex-row sm:gap-6">
          <div className="min-w-0 space-y-6">
            <p className="text-xs font-semibold tracking-[0.3em] text-primary uppercase">Franchise management</p>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight break-words sm:text-6xl">Build something<br />remarkable.</h1>
              <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">Your workspace is ready. A polished glass interface, motion-powered interactions, and a theme that follows your preference.</p>
            </div>
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button className="rounded-full px-6">Get started</Button>
              <span className="text-xs leading-relaxed text-muted-foreground">Press <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono">D</kbd> anytime to switch themes</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </main>
  )
}
