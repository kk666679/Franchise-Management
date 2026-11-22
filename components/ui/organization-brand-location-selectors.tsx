"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// OrganizationSelector - persists selection via URL param (shareable)
export interface OrganizationSelectorProps {
  /** Currently selected organization ID */
  selectedId?: string
  /** On organization change */
  onChange: (id: string) => void
  /** Organizations list */
  organizations: { id: string; name: string }[]
  /** Whether the selector is required */
  required?: boolean
  /** Show required asterisk */
  showAsterisk?: boolean
  /** Additional classes */
  className?: string
}

/** RSC-safe: purely presentational; URL persistence handled by parent. */
export function OrganizationSelector({
  selectedId,
  onChange,
  organizations,
  required = false,
  showAsterisk = true,
  className,
}: OrganizationSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className={cn(
      "relative",
      className,
    )}>
      <select
        onChange={handleChange}
        className={cn(
          "flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          "dark:border-dark",
        )}
      >
        <option value="" disabled>
          {selectedId ? "Select organization" : "Organization"}
        </option>
        {organizations.map((org) => (
          <option
            key={org.id}
            value={org.id}
            selected={selectedId === org.id}
          >
            {org.name}
          </option>
        ))}
      </select>
    </div>
  )
}

// BrandSelector - brand picker
export interface BrandSelectorProps {
  /** Currently selected brand ID */
  selectedId?: string
  /** On brand change */
  onChange: (id: string) => void
  /** Brands list */
  brands: { id: string; name: string }[]
  /** Whether the selector is required */
  required?: boolean
  /** Show required asterisk */
  showAsterisk?: boolean
  /** Additional classes */
  className?: string
}

/** RSC-safe: purely presentational. */
export function BrandSelector({
  selectedId,
  onChange,
  brands,
  required = false,
  showAsterisk = true,
  className,
}: BrandSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className={cn("relative", className)}>
      <select
        onChange={handleChange}
        className={cn(
          "flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          "dark:border-dark",
        )}
      >
        <option value="" disabled>
          {selectedId ? "Select brand" : "Brand"}
        </option>
        {brands.map((brand) => (
          <option key={brand.id} value={brand.id} selected={selectedId === brand.id}>
            {brand.name}
          </option>
        ))}
      </select>
    </div>
  )
}

// LocationSelector - branch/outlet picker
export interface LocationSelectorProps {
  /** Currently selected location ID */
  selectedId?: string
  /** On location change */
  onChange: (id: string) => void
  /** Locations list */
  locations: { id: string; name: string }[]
  /** Whether the selector is required */
  required?: boolean
  /** Show required asterisk */
  showAsterisk?: boolean
  /** Additional classes */
  className?: string
}

/** RSC-safe: purely presentational. */
export function LocationSelector({
  selectedId,
  onChange,
  locations,
  required = false,
  showAsterisk = true,
  className,
}: LocationSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className={cn("relative", className)}>
      <select
        onChange={handleChange}
        className={cn(
          "flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          "dark:border-dark",
        )}
      >
        <option value="" disabled>
          {selectedId ? "Select location" : "Location"}
        </option>
        {locations.map((location) => (
          <option key={location.id} value={location.id} selected={selectedId === location.id}>
            {location.name}
          </option>
        ))}
      </select>
    </div>
  )
}
