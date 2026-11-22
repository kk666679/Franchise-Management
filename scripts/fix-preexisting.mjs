import { readFileSync, writeFileSync } from "node:fs"

// Fix 1: feedback.tsx — wrong import path
const feedbackPath = "components/ui/feedback.tsx"
const feedback = readFileSync(feedbackPath, "utf8")
writeFileSync(feedbackPath, feedback.replace(`import { cn } from "@/lib-utils"`, `import { cn } from "cn"`), "utf8")
console.log("fixed feedback.tsx")

// Fix 2: validation.ts — zod v4 uses .issues not .errors
const validationPath = "lib/validation.ts"
const validation = readFileSync(validationPath, "utf8")
writeFileSync(
  validationPath,
  validation.replace(
    `  return error.errors.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }))`,
    `  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }))`
  ),
  "utf8"
)
console.log("fixed validation.ts")

// Fix 3: code-block.tsx — remove size="sm" from SelectTrigger (no longer valid)
const codeBlockPath = "components/ai-elements/code-block.tsx"
const codeBlock = readFileSync(codeBlockPath, "utf8")
writeFileSync(
  codeBlockPath,
  codeBlock.replace(`    size="sm"\n    {...props}\n  />`, `    {...props}\n  />`),
  "utf8"
)
console.log("fixed code-block.tsx")
