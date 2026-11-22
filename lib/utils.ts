import { cn as mergeClassNames, type ClassValue } from "cn"

/**
 * Combines conditional class names and resolves conflicting Tailwind classes.
 *
 * Keep this wrapper as the shared class-name boundary for the application so
 * components do not need to depend directly on the underlying merge engine.
 */
export function cn(...inputs: ClassValue[]): string {
  return mergeClassNames(...inputs)
}
