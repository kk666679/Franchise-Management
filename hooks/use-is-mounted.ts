"use client"

import * as React from "react"

/**
 * Returns true after the component mounts on the client.
 * Use for hydration-safe rendering of theme/browser-dependent UI.
 */
export function useIsMounted() {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}
