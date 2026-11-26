# ADR-0008: Prompt Template Governance

- Status: Pending
- Date: 2026-11-26
- Related paths: `lib/server/commerce/ai/prompt-registry.ts`, `prisma/commerce/schema.prisma` (PromptTemplate model), `app/dashboard/commerce/ai/prompts/page.tsx`, `components/commerce/ai/PromptTemplateEditor.tsx`

## Context

Who owns and controls the prompts that drive commerce AI agents? Franchisor provides base templates; franchisees need customization. This determines versioning, inheritance, override rules, and safety validation.

| Model | Franchisor Role | Franchisee Role | Versioning |
|---|---|---|---|
| Centralized | Owns all prompts | No customization | Single version |
| Federated | Provides base templates | Extends/overrides per territory | Template inheritance |
| Delegated | Provides guidelines | Owns all prompts | Independent |
| Marketplace | Curates certified templates | Installs from marketplace | Semantic versioning |

## Decision

**Federated with franchisor base templates + franchisee overrides.** Franchisor publishes base prompt templates for each agent type (fulfillment-optimizer, pricing-optimizer, concierge, voice-commerce). Franchisees can extend via override layers per territory. All templates versioned, validated for safety, and auditable.

## Consequences

- `PromptTemplate` model in `prisma/commerce/schema.prisma`:
  - `id`, `name`, `agentType`, `version`, `baseTemplateId` (nullable), `tenantId`, `territoryId`, `templateJson`, `isFranchisorBase`, `safetyScore`
- `lib/server/commerce/ai/prompt-registry.ts` resolves templates: franchisor base → franchisee override → territory override
- `app/dashboard/commerce/ai/prompts/page.tsx` shows inheritance tree with diff view
- `components/commerce/ai/PromptTemplateEditor.tsx` provides structured editor with variable validation
- Safety validation on save: no PII extraction, no external calls, no code execution
- Franchisor can push critical updates to base templates (franchisees see diff, can accept/defer)
- Template versioning follows semver; franchisees pin to specific versions