import { ShieldCheck } from "lucide-react"

import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden p-4 sm:p-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,oklch(0.4_0.15_285/18%),transparent_32%),radial-gradient(circle_at_80%_80%,oklch(0.35_0.14_220/15%),transparent_32%)]" />
      <section className="glass w-full max-w-md rounded-3xl p-6 sm:p-10" aria-labelledby="login-title">
        <div className="mb-8 space-y-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <ShieldCheck className="size-6" />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.24em] text-primary uppercase">Franchise management</p>
            <h1 id="login-title" className="mt-2 text-3xl font-semibold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Sign in to manage your brands, branches, and operations.</p>
          </div>
        </div>
        <LoginForm />
      </section>
    </main>
  )
}
