"use client"

import { useActionState } from "react"
import { Loader2, UserPlus } from "lucide-react"

import { signupAction, type SignupState } from "@/app/signup/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const initialState: SignupState = { status: "idle", message: "" }

export function SignupForm() {
  const [state, action, pending] = useActionState(signupAction, initialState)

  return (
    <form action={action} className="space-y-5" noValidate>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="name">
          Full name
        </label>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          placeholder="Alex Morgan"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="email">
          Work email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          required
        />
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        We will email a single-use sign-in link. No password is stored or
        transmitted.
      </p>
      <div aria-live="polite" className="min-h-5 text-sm">
        {state.status === "error" && (
          <p className="text-destructive">{state.message}</p>
        )}
        {state.status === "success" && (
          <p className="text-emerald-600">{state.message}</p>
        )}
      </div>
      <Button
        className="h-11 w-full rounded-full"
        disabled={pending}
        type="submit"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <UserPlus className="size-4" />
        )}
        {pending ? "Creating account…" : "Create account"}
      </Button>
    </form>
  )
}
