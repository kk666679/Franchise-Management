"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader2 } from "lucide-react"

import { loginAction, type LoginState } from "@/app/login/actions"
import { PasswordField } from "@/components/auth/password-field"
import { MagicLinkForm } from "@/components/auth/magic-link-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const initialState: LoginState = { status: "idle", message: "" }

export function LoginForm() {
  const router = useRouter()
  const [state, action, pending] = useActionState(loginAction, initialState)

  useEffect(() => {
    if (state.status === "success") router.push("/dashboard")
  }, [router, state.status])

  return (
    <div className="space-y-5">
      <form action={action} className="space-y-5" noValidate>
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            Work email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
            className="h-11"
          />
        </div>

        <PasswordField required placeholder="Enter your password" />

        <div aria-live="polite" className="min-h-5 text-sm">
          {state.status === "error" && (
            <p className="text-destructive">{state.message}</p>
          )}
          {state.status === "success" && (
            <p className="text-emerald-500">{state.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="h-11 w-full rounded-full"
          disabled={pending}
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ArrowRight className="size-4" />
          )}
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <div className="border-t pt-5">
        <p className="mb-3 text-center text-xs text-muted-foreground">
          Prefer passwordless sign-in?
        </p>
        <MagicLinkForm />
      </div>
    </div>
  )
}
