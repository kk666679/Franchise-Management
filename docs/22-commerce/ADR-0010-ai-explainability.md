# ADR-0010: AI Explainability Requirements

- Status: Pending
- Date: 2026-11-26
- Related paths: `lib/server/commerce/ai/reasoning/trace.ts`, `lib/server/commerce/pricing/guard.ts`, `components/commerce/guards/PriceReasoningDisplay.tsx`, `components/commerce/adapters/ReasoningDisplayAdapter.tsx`, `contracts/commerce/events/ai.pricing.reasoning.generated.v1.json`

## Context

What level of reasoning transparency is required for AI-driven commerce decisions? This affects pricing guard explanations, agent decision trails, regulatory compliance, and franchisee trust.

| Level | Scope | Format | Audience |
|---|---|---|---|
| None | Black box | — | — |
| Decision-only | Final output + confidence | JSON summary | Franchisee |
| Structured trace | Step-by-step with tool calls | ChainOfThought + Tool calls | Franchisee, auditor |
| Full reasoning | Model CoT + retrieval citations | Reasoning + Sources + InlineCitation | Franchisee, auditor, regulator |
| Replayable | Full input + model state + deterministic replay | Event log + model checkpoint | Forensic audit |

## Decision

**Structured trace (Level 3) for all pricing decisions and agent actions.** Every price validation emits a `ChainOfThought` with `Sources` citing franchise agreement clauses, tax registrations, and floor/ceiling configs. Every agent execution emits `Reasoning` with tool call trace. Full model CoT not required (proprietary), but retrieval citations mandatory. Events are replayable via outbox.

## Consequences

- `lib/server/commerce/pricing/guard.ts` returns `{ valid: boolean, reasoning: ChainOfThoughtStep[] }` not just boolean
- `lib/server/commerce/ai/reasoning/trace.ts` builds structured traces for all AI operations
- `PriceReasoningDisplay` guard component wraps `Reasoning` + `ChainOfThought` + `Sources` from ai-elements
- `ReasoningDisplayAdapter` composes the full explainability UI for receipts, dashboards, and agent monitoring
- `ai.pricing.reasoning.generated.v1` event emitted for every order (see architecture.md)
- `ai.agent.task.started.v1` and `ai.agent.task.completed.v1` include full reasoning traces
- Franchisee dashboard shows pricing reasoning per order, agent reasoning per task
- Auditor view: filter by territory, date, decision type; export reasoning trails
- Regulatory: pricing reasoning satisfies "algorithmic transparency" requirements in EU/US state laws
- Performance: reasoning generation async, non-blocking; cached for repeated identical queries