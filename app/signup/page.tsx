import Link from "next/link"

import { FmsBrand } from "@/components/branding/fms-brand"
import { PublicHeader } from "@/components/layout/public-header"
import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <main className="relative min-h-svh overflow-hidden">
      <PublicHeader />
      <div className="flex items-center justify-center p-4 sm:p-6">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,oklch(0.4_0.15_285/18%),transparent_32%),radial-gradient(circle_at_80%_80%,oklch(0.35_0.14_220/15%),transparent_32%)]" />
        <section
          className="w-full max-w-md rounded-3xl p-6 glass sm:p-10"
          aria-labelledby="signup-title"
        >
          <div className="mb-8 space-y-3">
            <FmsBrand imageClassName="h-auto w-56" />
            <div>
              <p className="text-xs font-semibold tracking-[0.24em] text-primary uppercase">
                Franchise management
              </p>
              <h1
                className="mt-2 text-3xl font-semibold tracking-tight"
                id="signup-title"
              >
                Create your workspace
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Start with a secure magic link. Your organization and owner
                membership are created automatically.
              </p>
            </div>
          </div>
          <SignupForm />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              className="font-medium text-primary hover:underline"
              href="/login"
            >
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}
