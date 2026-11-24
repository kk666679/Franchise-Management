"use client"

import * as React from "react"
import { cn } from "cn"

// --- Types ---
export type FeedbackVariant =
  "empty" | "loading" | "success" | "error" | "access-denied"
export type FeedbackSize = "sm" | "default" | "lg"

// --- Props ---
export interface FeedbackProps {
  /** Feedback variant state */
  variant: FeedbackVariant
  /** Feedback heading/title */
  heading?: string
  /** Feedback description text */
  description?: string
  /** Action button text (for success/ error states) */
  actionText?: string
  /** Action onClick handler */
  onAction?: () => void
  /** Whether to show dismiss button */
  showDismiss?: boolean
  /** Dismiss onClick handler */
  onDismiss?: () => void
  /** Additional classes */
  className?: string
}

/** RSC-safe: purely presentational; no form props across boundary. */
export function Feedback({
  variant,
  heading,
  description,
  actionText,
  onAction,
  showDismiss = true,
  onDismiss,
  className,
}: FeedbackProps) {
  const variants = {
    empty: cn(
      "place-items-center py-8 text-muted-foreground empty:grid",
      "dark:text-muted-foreground-secondary"
    ),
    loading: cn("loading:flex min-h-[200px]_items-center justify-center py-8"),
    success: cn(
      "success:flex min-h-[200px]_items-start bg-success/10 border-success/20 gap-4 rounded-md border p-6"
    ),
    error: cn(
      "error:flex min-h-[200px]_items-start bg-error/10 border-error/20 gap-4 rounded-md border p-6"
    ),
    "access-denied": cn(
      "access-denied:flex min-h-[200px]_items-start bg-warning/10 border-warning/20 gap-4 rounded-md border p-6"
    ),
  }

  const renderContent = () => {
    switch (variant) {
      case "empty": {
        return (
          <div className={variants.empty}>
            {heading && <h3 className="mb-2">{heading}</h3>}
            {description && <p>{description}</p>}
          </div>
        )
      }
      case "loading": {
        return (
          <div className={variants.loading}>
            <svg
              className="h-8 w-8 animate-spin text-primary"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12l4 8 4-8z"
              />
            </svg>
            <p
              className="text-foreground-strong ml-3 text-sm"
              style={{ margin: "8px 0 0" }}
            >
              Loading...
            </p>
          </div>
        )
      }
      case "success": {
        return (
          <div className={variants.success}>
            <svg
              className="text-success h-6 w-6 flex-shrink-0"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M22 11.08l-5.43 2.31 2.18 5.43-5.43 2.31L12 15.72l-6.18 2.21L2 22l10-5.01L12 4l8 4 1.71-4.72L12 1.75l-6.71 2.31L2 6l10 5.01L12 12.28l6.71 2.31z"
              />
            </svg>
            <div>
              {heading && <h3 className="mb-1">{heading}</h3>}
              {description && <p className="text-sm">{description}</p>}
            </div>
            {actionText && (
              <button
                onClick={onAction}
                className={cn(
                  "mt-3 inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90",
                  "dark:text-primary-foreground"
                )}
              >
                {actionText}
              </button>
            )}
          </div>
        )
      }
      case "error": {
        return (
          <div className={variants.error}>
            <svg
              className="text-error h-6 w-6 flex-shrink-0"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="M18 6L6 18M6 6l12 12" />
            </svg>
            <div>
              {heading && <h3 className="mb-1">{heading}</h3>}
              {description && <p className="text-sm">{description}</p>}
            </div>
            {actionText && (
              <button
                onClick={onAction}
                className={cn(
                  "mt-3 inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90",
                  "dark:text-primary-foreground"
                )}
              >
                {actionText}
              </button>
            )}
          </div>
        )
      }
      case "access-denied": {
        return (
          <div className={variants["access-denied"]}>
            <svg
              className="text-warning h-6 w-6 flex-shrink-0"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="M18 6L6 18M6 6l12 12" />
            </svg>
            <div>
              {heading && <h3 className="mb-1">{heading}</h3>}
              {description && <p className="text-sm">{description}</p>}
            </div>
          </div>
        )
      }
    }
  }

  return (
    <div
      className={cn(
        "flex min-h-[200px] flex-col items-center justify-center py-8",
        className
      )}
    >
      {renderContent()}
    </div>
  )
}
