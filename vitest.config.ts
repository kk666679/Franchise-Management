import path from "node:path"

import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname),
      "@lib": path.resolve(import.meta.dirname, "lib"),
    },
  },
  test: {
    testTimeout: 15000,
    hookTimeout: 15000,
    pool: 'forks',
    environment: "jsdom",
    globals: true,
    include: ["tests/**/*.{test,spec}.{ts,tsx}", "components/**/*.test.tsx"],
    setupFiles: ["./vitest.setup.ts"],
  },
})

