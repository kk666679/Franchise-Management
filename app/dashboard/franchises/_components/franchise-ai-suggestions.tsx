"use client"

import { useRouter } from "next/navigation"
import { Sparkles } from "lucide-react"

import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion"

const PORTFOLIO_PROMPTS = [
  "What should a franchise portfolio review cover?",
  "What are best practices for onboarding a new franchisee?",
]

const FRANCHISEE_PROMPTS = [
  "What should I include in a franchisee performance review?",
  "How should I prepare for a franchise agreement renewal?",
]

export function FranchiseAISuggestions({
  context,
}: {
  context: "portfolio" | "franchisee"
}) {
  const router = useRouter()
  const prompts =
    context === "portfolio" ? PORTFOLIO_PROMPTS : FRANCHISEE_PROMPTS

  function askAssistant(prompt: string) {
    const query = new URLSearchParams({ prompt })
    router.push(`/dashboard/ai?${query.toString()}`)
  }

  return (
    <section
      aria-labelledby="franchise-ai-guidance"
      className="space-y-3 rounded-2xl border border-border/70 bg-card/60 p-4"
    >
      <div className="flex items-start gap-3">
        <Sparkles
          aria-hidden="true"
          className="mt-0.5 size-4 shrink-0 text-primary"
        />
        <div>
          <h2 id="franchise-ai-guidance" className="text-sm font-semibold">
            Ask the franchise assistant
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Get general guidance. The assistant does not read these franchise
            records.
          </p>
        </div>
      </div>
      <Suggestions>
        {prompts.map((prompt) => (
          <Suggestion
            key={prompt}
            suggestion={prompt}
            onClick={askAssistant}
          />
        ))}
      </Suggestions>
    </section>
  )
}
