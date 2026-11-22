"use client"

import { useActionState } from "react"
import { KeyRound, Loader2 } from "lucide-react"

import { magicLinkAction, type LoginState } from "@/app/login/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const initialState: LoginState = { status: "idle", message: "" }

export function MagicLinkForm() {
  const [state, action, pending] = useActionState(magicLinkAction, initialState)

  return (
    <form action={action} className="space-y-4" noValidate>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="magic-email">
          Email for magic link
        </label>
        <Input
          id="magic-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          required
        />
      </div>
      <div aria-live="polite" className="min-h-5 text-sm">
        {state.status === "error" && (
          <p className="text-destructive">{state.message}</p>
        )}
        {state.status === "magic-link-sent" && (
          <p className="text-emerald-600">{state.message}</p>
        )}
      </div>
      <Button
        className="w-full rounded-full"
        disabled={pending}
        type="submit"
        variant="outline"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <KeyRound className="size-4" />
        )}
        {pending ? "Sending…" : "Email me a sign-in link"}
      </Button>
    </form>
  )
}
