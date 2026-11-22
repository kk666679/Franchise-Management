"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Field } from "./field"

// ── TextField ────────────────────────────────────────────────────────────────

type TextFieldProps = React.ComponentProps<"input"> & {
  label?: string
  error?: string
  hint?: string
}

export function TextField({ label, error, hint, id, required, className, ...props }: TextFieldProps) {
  const fieldId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined)
  return (
    <Field id={fieldId ?? ""} label={label} error={error} hint={hint} required={required} className={className}>
      <Input
        id={fieldId}
        aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
        aria-invalid={!!error}
        required={required}
        {...props}
      />
    </Field>
  )
}

// ── TextareaField ─────────────────────────────────────────────────────────────

type TextareaFieldProps = React.ComponentProps<"textarea"> & {
  label?: string
  error?: string
  hint?: string
}

export function TextareaField({ label, error, hint, id, required, className, ...props }: TextareaFieldProps) {
  const fieldId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined)
  return (
    <Field id={fieldId ?? ""} label={label} error={error} hint={hint} required={required} className={className}>
      <Textarea
        id={fieldId}
        aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
        aria-invalid={!!error}
        required={required}
        {...props}
      />
    </Field>
  )
}

// ── SelectField ───────────────────────────────────────────────────────────────

type SelectOption = { value: string; label: string }

type SelectFieldProps = {
  id?: string
  label?: string
  error?: string
  hint?: string
  required?: boolean
  placeholder?: string
  options: SelectOption[]
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  className?: string
}

export function SelectField({
  id,
  label,
  error,
  hint,
  required,
  placeholder = "Select…",
  options,
  value,
  onValueChange,
  disabled,
  className,
}: SelectFieldProps) {
  const fieldId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : "select")
  return (
    <Field id={fieldId} label={label} error={error} hint={hint} required={required} className={className}>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          id={fieldId}
          aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
          aria-invalid={!!error}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  )
}

// ── CheckboxField ─────────────────────────────────────────────────────────────

type CheckboxFieldProps = React.ComponentProps<typeof Checkbox> & {
  label?: string
  error?: string
  hint?: string
}

export function CheckboxField({ label, error, hint, id, className, ...props }: CheckboxFieldProps) {
  const fieldId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : "checkbox")
  return (
    <Field id={fieldId} error={error} hint={hint} className={className}>
      <div className="flex items-center gap-2">
        <Checkbox id={fieldId} aria-invalid={!!error} {...props} />
        {label && (
          <label htmlFor={fieldId} className="text-sm font-medium text-foreground cursor-pointer">
            {label}
          </label>
        )}
      </div>
    </Field>
  )
}

// ── SwitchField ───────────────────────────────────────────────────────────────

type SwitchFieldProps = React.ComponentProps<typeof Switch> & {
  label?: string
  description?: string
  error?: string
}

export function SwitchField({ label, description, error, id, className, ...props }: SwitchFieldProps) {
  const fieldId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : "switch")
  return (
    <div className="flex items-center justify-between gap-4">
      {(label || description) && (
        <div className="space-y-0.5">
          {label && (
            <label htmlFor={fieldId} className="text-sm font-medium text-foreground cursor-pointer">
              {label}
            </label>
          )}
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      )}
      <Switch id={fieldId} aria-invalid={!!error} {...props} />
    </div>
  )
}
