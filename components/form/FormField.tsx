"use client"

import * as React from "react"
import { Controller, useFormContext } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function FormField({
  name,
  label,
  children,
  className,
  description,
}: {
  name: string
  label: string
  children: React.ReactElement
  className?: string
  description?: string
}) {
  const { control } = useFormContext()
  const id = React.useId()
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={cn("space-y-1.5", className)}>
          <Label htmlFor={id}>{label}</Label>
          {React.cloneElement(children as React.ReactElement<any>, {
            ...field,
            id,
            "aria-invalid": fieldState.error ? true : undefined,
          })}
          {description && !fieldState.error ? (
            <p className="text-xs text-muted-foreground">{description}</p>
          ) : null}
          {fieldState.error ? (
            <p className="text-xs text-destructive" role="alert">
              {fieldState.error.message}
            </p>
          ) : null}
        </div>
      )}
    />
  )
}
