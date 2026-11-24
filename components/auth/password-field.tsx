"use client"

import { Eye, EyeOff } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type PasswordFieldProps = React.ComponentProps<typeof Input> & {
  label?: string
}

export function PasswordField({
  label = "Password",
  id = "password",
  ...props
}: PasswordFieldProps) {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <Input
          {...props}
          id={id}
          name={props.name ?? id}
          type={visible ? "text" : "password"}
          autoComplete={props.autoComplete ?? "current-password"}
          className="pr-11"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-1 size-7 -translate-y-1/2 rounded-full text-muted-foreground hover:text-foreground"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </Button>
      </div>
    </div>
  )
}
