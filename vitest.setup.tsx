import { expect } from "vitest"

console.log("[vitest.setup] registering toHaveNoViolations")

expect.extend({
  toHaveNoViolations(received: any) {
    const violations = received?.violations ?? []
    return {
      pass: violations.length === 0,
      message: () =>
        violations.length === 0
          ? "Expected accessibility violations but found none"
          : "Found " + violations.length + " a11y violation(s):\n" +
            violations.map((v: any) => "  - " + v.id + ": " + v.help).join("\n"),
    }
  },
})