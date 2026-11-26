# AI Governance Contract

## Model Access Policy

### Franchisor-Approved Model Catalog

The franchisor maintains a curated catalog of approved models per capability. Franchisees select from this catalog per territory.

```yaml
# contracts/commerce/ai-model-catalog.yaml
capabilities:
  reasoning:
    - id: "gpt-4o"
      provider: "openai"
      tier: "primary"
      cost_per_1k_input: 0.005
      cost_per_1k_output: 0.015
      regions: ["us-east-1", "eu-west-1"]
      capabilities: ["reasoning", "tool-use", "json-mode"]
    - id: "claude-3-5-sonnet"
      provider: "anthropic"
      tier: "secondary"
      cost_per_1k_input: 0.003
      cost_per_1k_output: 0.015
      regions: ["us-east-1", "eu-west-1"]
      capabilities: ["reasoning", "tool-use", "json-mode"]
    - id: "nemotron-3-ultra"
      provider: "nvidia"
      tier: "tertiary"
      cost_per_1k_input: 0.001
      cost_per_1k_output: 0.002
      regions: ["us-east-1"]
      capabilities: ["reasoning", "tool-use"]

  voice_stt:
    - id: "nova-2"
      provider: "deepgram"
      tier: "primary"
      cost_per_minute: 0.0043
      languages: ["en", "es", "fr", "de", "it", "pt", "ja", "ko", "zh"]
      streaming: true
    - id: "whisper-large-v3"
      provider: "openai"
      tier: "secondary"
      cost_per_minute: 0.006
      languages: ["99+"]
      streaming: false

  voice_tts:
    - id: "tts-1-hd"
      provider: "openai"
      tier: "primary"
      cost_per_1k_chars: 0.015
      voices: ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]
      streaming: true
    - id: "aura-asteria"
      provider: "deepgram"
      tier: "secondary"
      cost_per_1k_chars: 0.012
      voices: ["asteria", "orpheus", "helios", "zeus"]
      streaming: true

  vision:
    - id: "gpt-4o"
      provider: "openai"
      tier: "primary"
      cost_per_image: 0.00765
      capabilities: ["ocr", "classification", "extraction"]
    - id: "claude-3-5-sonnet"
      provider: "anthropic"
      tier: "secondary"
      cost_per_image: 0.0045
      capabilities: ["ocr", "classification", "extraction"]

  embeddings:
    - id: "text-embedding-3-large"
      provider: "openai"
      tier: "primary"
      cost_per_1k_tokens: 0.00013
      dimensions: 3072
    - id: "text-embedding-3-small"
      provider: "openai"
      tier: "secondary"
      cost_per_1k_tokens: 0.00002
      dimensions: 1536
```

### Territory Model Assignment

Each territory declares its model preferences. Franchisor base templates reference capability names (e.g., `reasoning.primary`); the gateway resolves to the territory's assigned model.

```typescript
// lib/server/commerce/ai/model-registry.ts
interface TerritoryModelConfig {
  tenantId: string
  territoryId: string
  assignments: {
    reasoning: { primary: string; fallback: string[] }
    voice_stt: { primary: string; fallback: string[] }
    voice_tts: { primary: string; fallback: string[] }
    vision: { primary: string; fallback: string[] }
    embeddings: { primary: string; fallback: string[] }
  }
  updatedAt: Date
  updatedBy: string // userId
}
```

## Agent Autonomy Enforcement

### Autonomy Level Metadata

Every agent tool declares its required autonomy level. The runner enforces the policy.

```typescript
// lib/server/commerce/ai/agent/tools/registry.ts
interface ToolDefinition {
  name: string
  description: string
  inputSchema: z.ZodSchema
  autonomyLevel: 'L0' | 'L1' | 'L2' | 'L3' | 'L4'
  requiresApproval: boolean
  sideEffects: 'read' | 'write' | 'external' | 'payment'
  idempotent: boolean
}

// Example: fulfillment optimizer tools
const fulfillmentTools: ToolDefinition[] = [
  {
    name: 'check_inventory',
    description: 'Check real-time inventory per territory',
    inputSchema: z.object({ territoryId: z.string(), skus: z.array(z.string()) }),
    autonomyLevel: 'L2',
    requiresApproval: false,
    sideEffects: 'read',
    idempotent: true,
  },
  {
    name: 'reserve_inventory',
    description: 'Reserve inventory for fulfillment',
    inputSchema: z.object({ items: z.array(z.object({ sku: z.string(), qty: z.number(), territoryId: z.string() })) }),
    autonomyLevel: 'L2',
    requiresApproval: false, // but streams to dashboard with kill switch
    sideEffects: 'write',
    idempotent: false,
  },
  {
    name: 'process_refund',
    description: 'Process payment refund via Stripe',
    inputSchema: z.object({ paymentId: z.string(), amountMinor: z.number(), reason: z.string() }),
    autonomyLevel: 'L1',
    requiresApproval: true, // Confirmation component required
    sideEffects: 'payment',
    idempotent: true, // idempotency key from order
  },
]
```

### Supervision Protocol

L2 agents stream execution to the franchisee dashboard via SSE. The franchisee can pause/stop at any checkpoint.

```typescript
// lib/server/commerce/ai/agent/runner.ts
interface AgentExecutionStream {
  taskId: string
  step: number
  tool: string
  input: unknown
  status: 'pending' | 'running' | 'awaiting_ack' | 'completed' | 'failed' | 'stopped'
  output?: unknown
  reasoning?: string
  checkpoint?: boolean // requires human acknowledgment
}

// SSE endpoint: GET /api/commerce/ai/agent/stream/:taskId
// Franchisee dashboard subscribes, shows real-time progress with kill switch
```

## Prompt Template Governance

### Template Inheritance Resolution

```typescript
// lib/server/commerce/ai/prompt-registry.ts
interface ResolvedPrompt {
  templateId: string
  version: string
  agentType: string
  systemPrompt: string
  toolDefinitions: ToolDefinition[]
  variables: Record<string, z.ZodSchema>
  safetyScore: number // 0-100, validated on save
  inheritanceChain: string[] // [franchisor-base-id, franchisee-override-id, territory-override-id]
}

async function resolvePrompt(agentType: string, tenantId: string, territoryId: string): Promise<ResolvedPrompt> {
  // 1. Get franchisor base template (isFranchisorBase=true, latest version)
  const base = await prisma.promptTemplate.findFirst({
    where: { agentType, isFranchisorBase: true },
    orderBy: { version: 'desc' },
  })

  // 2. Get franchisee override (tenantId, agentType, isFranchisorBase=false)
  const franchiseeOverride = await prisma.promptTemplate.findFirst({
    where: { agentType, tenantId, isFranchisorBase: false, territoryId: null },
    orderBy: { version: 'desc' },
  })

  // 3. Get territory override (tenantId, territoryId, agentType)
  const territoryOverride = await prisma.promptTemplate.findFirst({
    where: { agentType, tenantId, territoryId, isFranchisorBase: false },
    orderBy: { version: 'desc' },
  })

  // 4. Merge: base → franchisee → territory (deep merge for systemPrompt, replace for tools/variables)
  return mergeTemplates(base, franchiseeOverride, territoryOverride)
}
```

### Safety Validation

On template save, run automated safety checks:

```typescript
// lib/server/commerce/ai/prompt-registry.ts
async function validatePromptSafety(template: PromptTemplateInput): Promise<SafetyReport> {
  const checks = [
    checkNoPIIExtraction(template.systemPrompt),
    checkNoExternalCalls(template.systemPrompt),
    checkNoCodeExecution(template.systemPrompt),
    checkToolWhitelist(template.toolDefinitions),
    checkVariableConstraints(template.variables),
  ]

  const results = await Promise.all(checks)
  const score = calculateSafetyScore(results)

  return { score, checks: results, passed: score >= 70 }
}
```

## Multimodal Data Policy

### Storage & Retention

| Data Type | Encryption | Retention | Deletion Trigger |
|---|---|---|---|
| Voice transcripts | AES-256 at rest, TLS in transit | 30 days | Auto-expire + GDPR request |
| Voice recordings | Never stored (stream-only) | N/A | N/A |
| Uploaded images | AES-256 at rest | 90 days | Auto-expire + GDPR request |
| Vision analysis | AES-256 at rest | 30 days | Auto-expire |
| Screen captures | Processed client-side, context only sent | Session | Tab close |
| TTS audio | Not stored | N/A | N/A |

### Regional Processing

```typescript
// lib/server/commerce/ai/multimodal/processor.ts
interface RegionalConfig {
  territoryId: string
  sttProvider: 'deepgram-eu' | 'deepgram-us' | 'whisper-selfhosted-eu'
  visionProvider: 'gpt-4o-eu' | 'claude-eu' | 'selfhosted-eu'
  ttsProvider: 'openai-eu' | 'deepgram-eu'
  dataResidency: 'eu' | 'us' | 'global'
}

function getRegionalConfig(territoryId: string): RegionalConfig {
  const territory = await getTerritory(territoryId)
  if (territory.region === 'EU') {
    return {
      territoryId,
      sttProvider: 'deepgram-eu',
      visionProvider: 'gpt-4o-eu',
      ttsProvider: 'openai-eu',
      dataResidency: 'eu',
    }
  }
  // Default US
  return {
    territoryId,
    sttProvider: 'deepgram-us',
    visionProvider: 'gpt-4o',
    ttsProvider: 'openai',
    dataResidency: 'us',
  }
}
```

## Explainability Requirements

### Pricing Reasoning Schema

Every price validation returns a structured reasoning trace:

```typescript
// lib/server/commerce/pricing/guard.ts
interface PriceReasoningTrace {
  valid: boolean
  basePriceMinor: number
  finalPriceMinor: number
  chainOfThought: ChainOfThoughtStep[]
  sources: SourceCitation[]
  guardChecks: GuardCheck[]
  cached: boolean
  generatedAt: Date
}

interface ChainOfThoughtStep {
  step: string
  input: unknown
  output: unknown
  reasoning: string
  toolCalls?: ToolCall[]
}

interface SourceCitation {
  type: 'franchise_agreement' | 'tax_registration' | 'floor_ceiling_config' | 'royalty_schedule'
  reference: string // e.g., "franchise_agreement_v3_section_4.2"
  url?: string
  excerpt: string
}

interface GuardCheck {
  name: 'floor' | 'ceiling' | 'tax' | 'royalty'
  input: unknown
  passed: boolean
  details: string
}
```

### Agent Reasoning Schema

Every agent execution emits a reasoning trace:

```typescript
// lib/server/commerce/ai/reasoning/trace.ts
interface AgentReasoningTrace {
  taskId: string
  agentName: string
  plan: PlanStep[]
  execution: ExecutionStep[]
  finalReasoning: string
  decision: AgentDecision
}

interface PlanStep {
  step: number
  tool: string
  args: unknown
  expectedOutput: string
  checkpoint: boolean
}

interface ExecutionStep {
  step: number
  tool: string
  args: unknown
  output: unknown
  reasoning: string
  durationMs: number
  status: 'completed' | 'failed' | 'skipped' | 'stopped'
}

interface AgentDecision {
  action: string
  confidence: number // 0-1
  alternativesConsidered: string[]
  humanIntervention?: {
    atStep: number
    action: 'approved' | 'modified' | 'stopped'
    by: string // userId
    reason: string
  }
}
```

## Audit & Compliance

### Event Log Requirements

All AI governance events are emitted to the event bus:

| Event | Trigger | Retention |
|---|---|---|
| `ai.model.assigned.v1` | Territory model config changed | 7 years |
| `ai.agent.task.started.v1` | L2/L3 agent execution begins | 7 years |
| `ai.agent.task.completed.v1` | Agent execution ends | 7 years |
| `ai.agent.task.stopped.v1` | Human killed agent | 7 years |
| `ai.prompt.updated.v1` | Template saved | 7 years |
| `ai.prompt.safety.failed.v1` | Template rejected by safety check | 7 years |
| `ai.multimodal.data.purged.v1` | GDPR/retention deletion | 7 years |
| `ai.pricing.reasoning.generated.v1` | Price validation with reasoning | 7 years |

### Franchisee Transparency Dashboard

Every franchisee has access to:

1. **Pricing Reasoning** — Per-order `ChainOfThought` with `Sources`
2. **Agent Activity** — Real-time + historical agent executions with reasoning
3. **Model Usage** — Which models used, when, cost, latency
4. **Multimodal Data** — What was uploaded, processed, retained
4. **Prompt Templates** — Inheritance tree, diffs, safety scores
5. **Export** — Full reasoning trail export for auditors

## Violation Handling

| Violation | Detection | Response |
|---|---|---|
| Unapproved model used | Gateway routing logs | Alert + automatic fallback to approved |
| L2 agent exceeds scope | Tool call allowlist check | Stop execution + alert |
| Prompt safety score < 70 | Save-time validation | Reject save + require franchisor review |
| Multimodal data retained past TTL | Daily cron job | Auto-purge + audit log |
| Reasoning trace missing | Event validation | Alert + backfill from cache |
| Cross-tenant data access | RLS policy violation | Block + alert + incident review |