# ADR-0006: AI Model Strategy

- Status: Pending
- Date: 2026-11-26
- Related paths: `lib/server/commerce/ai/provider.ts`, `lib/server/commerce/ai/model-registry.ts`, `app/dashboard/commerce/ai/page.tsx`, `components/commerce/adapters/ModelSelectorAdapter.tsx`

## Context

Which AI models power the commerce plane's agentic workflows, reasoning, voice, and generative capabilities? This determines provider relationships, cost structure, latency SLAs, data residency, and fallback behavior.

| Option | Models | Provider | Cost Model | Data Residency |
|---|---|---|---|---|
| Single provider (OpenAI) | GPT-4o, GPT-4o-mini, o1 | OpenAI | Per-token | US only |
| Multi-provider gateway | GPT-4o, Claude 3.5, Gemini 1.5 | Kilo Gateway / Vercel AI Gateway | Per-token + routing | Multi-region |
| Open-source self-hosted | Llama 3.1 405B, Nemotron 3 Ultra | Self-hosted / Together / Fireworks | Per-GPU-hour | Full control |
| Hybrid (cloud + local) | Cloud for reasoning, local for embeddings | Mixed | Hybrid | Selective |

## Decision

**Multi-provider gateway with franchisor-approved model list.** The franchisor curates a list of approved models per capability (reasoning, voice, vision, coding). Franchisees select from this list per territory. The gateway handles routing, fallbacks, and cost tracking.

## Consequences

- `lib/server/commerce/ai/provider.ts` abstracts over multiple providers via Vercel AI SDK
- `lib/server/commerce/ai/model-registry.ts` maintains franchisor-approved model catalog with capability tags
- `app/dashboard/commerce/ai/page.tsx` provides model selection UI with cost estimates
- `components/commerce/adapters/ModelSelectorAdapter.tsx` wraps `ModelSelector` from ai-elements
- Fallback chain: primary → secondary → tertiary per capability
- Cost tracking per franchisee per model per capability
- Data residency: EU franchisees route to EU-hosted models (Mistral, self-hosted)