# Commerce Plane Architecture (Upgraded v2)

See the full one-page architecture in the product specification. Summary:

## Control plane vs commerce plane

| | Control plane | Commerce plane |
|---|---|---|
| Concern | Franchise relationship | Customer transaction + AI commerce |
| Scope | Organization, territory, contract, royalty, audit | Catalog, cart, checkout, payments, fulfillment, **AI concierge, multimodal assistant, generative UI** |
| UI | `app/dashboard/*` | `app/shop/[tenant]/*`, `app/shop/[tenant]/assistant/*`, `app/shop/[tenant]/concierge/*` |
| Server | `lib/server/{services,actions}/*` | `lib/server/commerce/*`, `lib/server/commerce/ai/*` |
| DB | Prisma (franchise schema) | `prisma/commerce/schema.prisma` |

## Isolation rule

A fail-stop in either plane cannot raise p99 or error rate in the other. Proven by chaos test, not by assertion.

## Cross-plane communication

Versioned, idempotent, replayable event bus:
- `order.created.v1`
- `order.paid.v1`
- `order.refunded.v1`
- `order.fulfilled.v1`
- `fulfillment.shipped.v1`
- `ai.agent.task.started.v1`
- `ai.agent.task.completed.v1`
- `ai.pricing.reasoning.generated.v1`

Cross-plane reads go through the API or the event log — never through a join.

## AI Commerce Layer (New)

The commerce plane now includes a first-class AI layer built on `components/ai-elements/*`:

### Agentic Workflows (`Agent`, `Plan`, `TaskList`, `Queue`, `AgentTools`)
- Autonomous order processing, inventory reconciliation, pricing optimization
- Transparent reasoning via `Reasoning` + `ChainOfThought` components
- Franchisee-visible agent execution with interrupt capability

### Generative UI (`Artifact`, `Canvas`, `WebPreview`, `JSXPreview`)
- Live product configurators with AI-generated variants
- Dynamic checkout previews, generated landing pages
- Visual configuration graphs via React Flow canvas

### Multimodal Commerce (`PromptInput`, `SpeechInput`, `VoiceSelector`, `Image`, `AudioPlayer`, `FileTree`)
- Voice commerce: "Reorder last month's coffee"
- Photo-based product search & receipt OCR for returns
- Screen-capture checkout assistance

### Explainable Commerce (`Reasoning`, `ChainOfThought`, `Sources`, `InlineCitation`)
- Full pricing audit trail with tax regulation citations
- Franchise agreement clause references for returns/policies
- Royalty calculation transparency

### Real-time Collaborative (`MessageBranch`, `Conversation`, `PromptInput`)
- Multi-user cart editing with Git-like branching
- Franchisee + customer co-browsing
- Live order tracking with streaming updates

### Developer Experience (`Terminal`, `CodeBlock`, `SchemaDisplay`, `TestResults`, `StackTrace`)
- Webhook debugger, event schema explorer
- Integration test runner in dashboard
- Commerce API playground

## Component Boundary Rules (Extended)

The commerce plane has five layers of components:

| Layer | Location | Purpose | Can Import |
|-------|----------|---------|------------|
| Primitive (Base UI) | `components/commerce/ui/*` | Commerce primitives (vendored shadcnstore) | tokens |
| Primitive (AI) | `components/ai-elements/*` | AI interaction primitives | Radix UI, tokens |
| Adapter | `components/commerce/adapters/*` | Binds vendored blocks to tenant, pricing, cart, **AI** | primitives, hooks |
| Guard | `components/commerce/guards/*` | Enforces boundaries (price, tenant, **AI policy**) | hooks |
| AI Composed | `components/commerce/ai/*` | **Pre-composed AI commerce patterns** | adapters, ai-elements, guards |

**Rule**: Pages never import `components/commerce/ui/*` or `components/ai-elements/*` directly. They import adapters or AI-composed components. This keeps vendored block sources and AI primitives replaceable.

## Route Map (Extended)

### Customer-facing (`app/shop/[tenant]/*`)

| URL | File | Purpose | Blocks Used |
|-----|------|---------|-------------|
| `/shop/acme` | `page.tsx` | Storefront home | `storefront-hero-1` |
| `/shop/acme/c/coffee` | `c/[...slug]/page.tsx` | Category page | `product-grid-1` |
| `/shop/acme/products` | `products/page.tsx` | All products + filters | `product-grid-1` + filters |
| `/shop/acme/products/ethiopia` | `products/[slug]/page.tsx` | Product detail | `product-detail-1` |
| `/shop/acme/cart` | `cart/page.tsx` | Cart | `cart-drawer-1` |
| `/shop/acme/checkout` | `checkout/page.tsx` | Checkout | `checkout-single-page-1` |
| `/shop/acme/checkout/confirmation/[orderId]` | `checkout/confirmation/[orderId]/page.tsx` | Order confirmation | `checkout-confirmation-1` |
| `/shop/acme/account` | `account/page.tsx` | Account overview | app shell |
| `/shop/acme/account/orders` | `account/orders/page.tsx` | Order history | `order-history-1` |
| `/shop/acme/account/orders/[orderId]` | `account/orders/[orderId]/page.tsx` | Order detail | `order-detail-1` |
| **`/shop/acme/assistant`** | **`assistant/page.tsx`** | **Multimodal AI commerce assistant** | **`PromptInput`, `SpeechInput`, `Message`, `Conversation`, `Artifact`, `Canvas`** |
| **`/shop/acme/concierge`** | **`concierge/page.tsx`** | **Agentic order concierge** | **`Agent`, `Plan`, `TaskList`, `Queue`, `Reasoning`, `ChainOfThought`** |
| **`/shop/acme/configure/[productId]`** | **`configure/[productId]/page.tsx`** | **Generative product configurator** | **`Artifact`, `Canvas`, `WebPreview`, `JSXPreview`** |

### Franchise-admin (`app/dashboard/commerce/*`)

| URL | Purpose |
|-----|---------|
| `/dashboard/commerce` | Commerce overview, today's orders, exceptions |
| `/dashboard/commerce/catalog` | Product catalogue (franchise-scoped) |
| `/dashboard/commerce/pricing` | Per-territory price overrides |
| `/dashboard/commerce/orders` | Order list (franchise-scoped) |
| `/dashboard/commerce/returns` | RMA queue |
| `/dashboard/commerce/settings/payment-routing` | Territory → Stripe account map |
| `/dashboard/commerce/settings/tax` | Tax registration status per territory |
| **`/dashboard/commerce/ai`** | **AI agent monitoring, prompt templates, model selector** |
| **`/dashboard/commerce/integrations`** | **Webhook debugger, schema explorer, test runner** |

### API (`app/shop/[tenant]/api/*`)

| Route | Purpose |
|-------|---------|
| `/webhook/payment` | Receive Stripe webhooks (idempotent) |
| `/webhook/fulfillment` | Receive fulfillment provider webhooks |
| `/internal/territory-resolve` | Server-to-server territory lookup |
| **`/ai/agent/run`** | **Execute commerce agent task** |
| **`/ai/agent/plan`** | **Get agent execution plan (SSE)** |
| **`/ai/pricing/reasoning`** | **Get pricing decision trail** |
| **`/ai/voice/process`** | **Process voice commerce input** |
| **`/ai/generate/variant`** | **Generate product variant (configurator)** |

## Order Creation Flow — The Critical Path (Extended)

```text
User clicks "Place order" (or says "Order my usual" via voice)
    │
    ▼
POST app/shop/[tenant]/checkout/actions.ts → placeOrder()
    │
    ├─ 1. Idempotency check (middleware)
    │   key = clientOpId from cart (or voice session)
    │   if exists → return prior result
    ├─ 2. Tenant resolution
    │   ctx = resolveTenant(tenantSlug)
    │   if ctx.tenantId !== cart.tenantId → 404
    ├─ 3. Price re-validation (server-side, not trust client)
    │   for each line: guard.check(variantId, territoryId, unitPrice)
    │   if any violation → CommerceError('price_out_of_bounds')
    ├─ 4. Transaction (DB)
    │   BEGIN
    │     INSERT Order
    │     INSERT OrderLines
    │     INSERT OutboxEntry(order.created.v1, payload)
    │     INSERT IdempotencyKey(clientOpId, response)
    │   COMMIT
    ├─ 5. Emit event (post-commit, best-effort)
    │   eventBus.publish(order.created.v1)
    │   — failure here does NOT fail the order
    │   — outbox row stays 'pending' until a worker retries
    ├─ 6. **Emit AI events (parallel, non-blocking)**
    │   eventBus.publish(ai.pricing.reasoning.generated.v1) — for explainable receipt
    │   eventBus.publish(ai.agent.task.started.v1) — if concierge auto-fulfillment enabled
    └─ 7. Return orderId → redirect to /confirmation/[orderId] (or stream to Assistant UI)
```

**Critical invariant**: Steps 1–4 are atomic. Steps 5–6 are decoupled. This is what "checkout, royalty, and AI fail independently" actually means.

## Event Contracts (Extended)

### order.created.v1.json (unchanged)
```json
{
  "$schema": "https://cloudevents.io/schemas/io.cloudevents",
  "specversion": "1.0",
  "type": "com.franchise.commerce.order.created.v1",
  "source": "/commerce/orders",
  "idempotencykey": "{clientOpId}",
  "time": "2026-11-26T10:30:00Z",
  "datacontenttype": "application/json",
  "data": {
    "orderId": "uuid",
    "tenantId": "uuid",
    "franchiseId": "uuid",
    "territoryId": "uuid",
    "customerId": "uuid | null",
    "totalMinor": 12500,
    "currency": "USD",
    "lines": [
      { "sku": "ETH-001", "qty": 2, "unitPriceMinor": 6250 }
    ],
    "createdAt": "2026-11-26T10:30:00Z"
  }
}
```

### ai.pricing.reasoning.generated.v1.json (NEW)
```json
{
  "$schema": "https://cloudevents.io/schemas/io.cloudevents",
  "specversion": "1.0",
  "type": "com.franchise.commerce.ai.pricing.reasoning.generated.v1",
  "source": "/commerce/pricing",
  "idempotencykey": "{orderId}",
  "time": "2026-11-26T10:30:00Z",
  "datacontenttype": "application/json",
  "data": {
    "orderId": "uuid",
    "tenantId": "uuid",
    "territoryId": "uuid",
    "reasoning": {
      "basePriceMinor": 6250,
      "floorMinor": 5000,
      "ceilingMinor": 7500,
      "territoryAdjustments": [
        { "type": "tax", "rate": 0.0825, "authority": "TX Franchisee Registration #TX-2024" },
        { "type": "royalty", "rate": 0.06, "basis": "franchise_agreement_v3_section_4.2" }
      ],
      "finalPriceMinor": 6750,
      "chainOfThought": [
        { "step": "base_lookup", "input": "SKU ETH-001", "output": 6250 },
        { "step": "floor_ceiling_guard", "input": { "floor": 5000, "ceiling": 7500 }, "output": "pass" },
        { "step": "tax_resolution", "input": "territory=TX", "output": { "rate": 0.0825, "model": "seller_of_record" } },
        { "step": "royalty_calculation", "input": { "base": 6250, "rate": 0.06 }, "output": 375 }
      ]
    }
  }
}
```

### ai.agent.task.started.v1.json (NEW)
```json
{
  "$schema": "https://cloudevents.io/schemas/io.cloudevents",
  "specversion": "1.0",
  "type": "com.franchise.commerce.ai.agent.task.started.v1",
  "source": "/commerce/ai/agent",
  "idempotencykey": "{taskId}",
  "time": "2026-11-26T10:30:00Z",
  "datacontenttype": "application/json",
  "data": {
    "taskId": "uuid",
    "agentName": "fulfillment-optimizer",
    "tenantId": "uuid",
    "territoryId": "uuid",
    "input": {
      "orderId": "uuid",
      "objective": "minimize_split_shipments",
      "constraints": ["franchisee_payout_optimization", "delivery_sla_24h"]
    },
    "plan": [
      { "step": 1, "tool": "check_inventory", "args": { "territoryId": "..." } },
      { "step": 2, "tool": "calculate_shipping", "args": { "destinations": [...] } },
      { "step": 3, "tool": "reserve_inventory", "args": { "items": [...] } },
      { "step": 4, "tool": "emit_fulfillment", "args": { "shipments": [...] } }
    ]
  }
}
```

### ai.agent.task.completed.v1.json (NEW)
```json
{
  "$schema": "https://cloudevents.io/schemas/io.cloudevents",
  "specversion": "1.0",
  "type": "com.franchise.commerce.ai.agent.task.completed.v1",
  "source": "/commerce/ai/agent",
  "idempotencykey": "{taskId}",
  "time": "2026-11-26T10:35:00Z",
  "datacontenttype": "application/json",
  "data": {
    "taskId": "uuid",
    "agentName": "fulfillment-optimizer",
    "status": "completed",
    "result": {
      "shipments": [
        { "territoryId": "uuid", "items": [...], "carrier": "UPS", "trackingRef": "1Z999..." }
      ],
      "payoutOptimization": { "franchiseeId": "uuid", "amountMinor": 12500 }
    },
    "reasoning": "Single-territory fulfillment optimal. Cross-territory split would add $3.50 shipping per unit.",
    "durationMs": 4200
  }
}
```

**Consumer contract** (royalty service, AI agents):
- Must be idempotent on `idempotencykey`
- Must NOT block on schema validation failure — log and dead-letter
- Must emit `royalty.calculated.v1` / `ai.agent.task.completed.v1` back to the control plane
- **AI agents must emit reasoning traces for audit**

**Replay semantics**: The outbox retains events for 30 days. A consumer that falls behind can replay. Events are immutable once emitted. AI agent events include full reasoning for replay debugging.

## Tenancy and Isolation (Extended)

### Three-layer tenancy (unchanged)

| Layer | Boundary | Enforcement |
|-------|----------|-------------|
| Franchisor | Cross-territory visibility | Session role `franchisor_admin` |
| Territory | Franchisee sees only their own orders | `commerce.tenantId` on every query |
| Franchisee user | Individual staff | Session role `franchisee_staff` |

### AI Tenancy (NEW)

| Layer | Boundary | Enforcement |
|-------|----------|-------------|
| Agent Scope | Agents only access their tenant's data | `tenantId` injected into agent context |
| Model Access | Franchisees choose approved models only | `ModelSelector` restricted by franchise agreement |
| Prompt Templates | Franchisor provides base templates, franchisees extend | Template inheritance with override validation |
| Data Residency | AI processing respects territory data laws | Regional model routing per territory config |

### RLS Backstop (Extended)

```sql
-- prisma/commerce/policies.sql
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
CREATE POLICY order_tenant_isolation ON "Order"
  USING (tenantId = current_setting('app.tenant_id')::uuid);
CREATE POLICY order_territory_isolation ON "Order"
  USING (territoryId = current_setting('app.territory_id')::uuid);

-- NEW: AI tables
ALTER TABLE "AgentTask" ENABLE ROW LEVEL SECURITY;
CREATE POLICY agent_task_tenant_isolation ON "AgentTask"
  USING (tenantId = current_setting('app.tenant_id')::uuid);

ALTER TABLE "PromptTemplate" ENABLE ROW LEVEL SECURITY;
CREATE POLICY prompt_template_tenant_isolation ON "PromptTemplate"
  USING (tenantId = current_setting('app.tenant_id')::uuid OR is_franchisor_template = true);
```

Set per request:
```ts
// lib/server/commerce/tenant/context.ts
await prisma.$executeRaw`SELECT set_config('app.tenant_id', ${ctx.tenantId}, true)`
await prisma.$executeRaw`SELECT set_config('app.territory_id', ${ctx.territoryId}, true)`

// NEW: AI context
await prisma.$executeRaw`SELECT set_config('app.ai_agent_scope', ${ctx.agentScope}, true)`
```

### IDOR Test (Extended)

```ts
// tests/integration/commerce/tenant-isolation.test.ts
it('tenant A cannot read tenant B order', async () => {
  const orderB = await createOrder({ tenantId: 'B' })
  const result = await getOrder(orderB.id, { tenantId: 'A' })
  expect(result).toBeNull() // 404, not 403 — don't leak existence
})

// NEW: AI isolation tests
it('tenant A cannot read tenant B agent task', async () => {
  const taskB = await createAgentTask({ tenantId: 'B', agentName: 'pricing-optimizer' })
  const result = await getAgentTask(taskB.id, { tenantId: 'A' })
  expect(result).toBeNull()
})

it('tenant A cannot execute agent on tenant B data', async () => {
  await expect(runAgent({ tenantId: 'A', targetTenantId: 'B', agent: 'fulfillment-optimizer' }))
    .rejects.toThrow('FORBIDDEN')
})
```

## Testing Strategy (Extended)

| Layer | Coverage | Tool |
|-------|----------|------|
| Pricing guard | Floor/ceiling rejection per territory | Vitest unit |
| Territory resolver | Slug → territory mapping, invalid slug | Vitest unit |
| Idempotency | Duplicate key returns prior result | Vitest integration |
| Checkout flow | Cart → order → event emit | Vitest integration |
| Payment webhook | Idempotent receiver, replay handling | Vitest integration |
| Tenant isolation | Cross-tenant IDOR returns 404 | Vitest integration |
| **Pricing reasoning** | **ChainOfThought matches guard decision** | **Vitest unit** |
| **Agent execution** | **Plan → tool calls → result → event emit** | **Vitest integration** |
| **Voice commerce** | **SpeechInput → transcript → order creation** | **Vitest integration** |
| **Generative configurator** | **Canvas nodes → variant → add to cart** | **Vitest integration** |
| **AI tenant isolation** | **Cross-tenant agent/task access blocked** | **Vitest integration** |
| Plane independence (chaos) | Kill royalty consumer, run 100 checkouts, assert 0 fails | Vitest + fault injection |
| Plane independence (reverse) | Kill commerce DB, run 100 royalty jobs, assert 0 fails | Vitest + fault injection |
| **AI chaos** | **Kill AI agent worker, checkouts continue, tasks queued** | **Vitest + fault injection** |
| **AI reasoning chaos** | **Reasoning service down, prices still validate, receipt shows cached** | **Vitest + fault injection** |
| A11y (Base UI stack) | Every commerce block passes axe | Vitest + jest-axe |
| **A11y (AI stack)** | **Every ai-elements component passes axe** | **Vitest + jest-axe** |
| E2E | Full browse → cart → checkout flow | Playwright |
| **E2E AI** | **Voice order → agent fulfillment → confirmation** | **Playwright** |

### Chaos Tests (Extended)

```ts
// tests/chaos/commerce/royalty-consumer-down.test.ts
it('checkout p99 is unaffected when royalty consumer is down', async () => {
  await killConsumer('royalty')
  const baseline = await measureP99(() => checkout(), 100)
  await restoreConsumer('royalty')
  const restored = await measureP99(() => checkout(), 100)
  expect(baseline.p99).toBeLessThan(restored.p99 * 1.2) // within 20%
  expect(baseline.errorRate).toBe(0)
})

// NEW: AI agent worker down
it('checkout p99 unaffected when AI agent worker is down', async () => {
  await killWorker('ai-agent')
  const baseline = await measureP99(() => checkout(), 100)
  await restoreWorker('ai-agent')
  const restored = await measureP99(() => checkout(), 100)
  expect(baseline.p99).toBeLessThan(restored.p99 * 1.2)
  expect(baseline.errorRate).toBe(0)
  // Verify tasks are queued, not lost
  const queued = await getQueuedAgentTasks()
  expect(queued.length).toBeGreaterThan(0)
})

// NEW: Reasoning service down — prices still work, receipts show cached reasoning
it('price validation works when reasoning service is down', async () => {
  await killService('pricing-reasoning')
  const result = await checkout({ lines: [{ sku: 'ETH-001', qty: 1 }] })
  expect(result.success).toBe(true)
  const receipt = await getReceipt(result.orderId)
  expect(receipt.reasoning.cached).toBe(true)
  expect(receipt.reasoning.chainOfThought).toBeDefined()
})
```

## Integration with the Franchise Roadmap (Extended)

This commerce plane slots into the existing 21-phase roadmap as a parallel track that starts after Phase 9 (service contracts) and completes in Phase 17 (integrations).

| Phase | Commerce Work | AI Work |
|-------|---------------|---------|
| Phase 1 | Commerce ADRs written (extend 01-prd.md) | **AI ADRs written (ADR-0006 through ADR-0010)** |
| Phase 8 | Tenant model extended with commerce tenant IDs | **Tenant model extended with AI preferences, model access** |
| Phase 9 | Commerce DB schema defined separately | **AI tables added: AgentTask, PromptTemplate, ReasoningTrace** |
| Phase 10 | Franchise creates commerce tenant on onboard | **Franchisee onboards Stripe Connect + selects AI models** |
| Phase 11 | POS and commerce share order.created.v1 event | **POS and commerce share ai.agent.task events** |
| Phase 12 | Commerce inventory reads from franchise inventory service | **AI agents read inventory for fulfillment optimization** |
| Phase 15 | Commerce orders visible in control plane audit | **AI agent decisions visible in control plane audit** |
| Phase 16 | AI hooks for commerce (fraud, upsell) — same as POS | **AI concierge, multimodal assistant, generative configurator GA** |
| Phase 17 | Commerce event bus integrated with control plane consumers | **AI event bus integrated; franchisor sees cross-territory AI insights** |
| Phase 18 | Chaos tests prove plane independence | **AI chaos tests prove AI independence** |
| Phase 19 | Commerce runbook added to docs/19-runbook.md | **AI runbook: agent failures, model fallbacks, prompt injection defense** |
| Phase 20 | Commerce included in UAT | **AI commerce UAT: voice, vision, agent workflows** |

**New AI ADRs to write** (Phase 1):
- ADR-0006: AI Model Strategy (which models, providers, fallback chain)
- ADR-0007: Agent Autonomy Levels (fully autonomous vs human-in-the-loop)
- ADR-0008: Prompt Template Governance (franchisor vs franchisee ownership)
- ADR-0009: Multimodal Data Handling (voice recordings, images, PII)
- ADR-0010: AI Explainability Requirements (what reasoning must be surfaced)

## What's Not in This Structure (Extended)

Three things deliberately omitted that a reader might expect:

1. **The 58 shadcnstore blocks**. Only ~8 blocks are used in v1. The rest are listed in `docs/22-commerce/block-inventory.md` as available for later phases. Vendoring all 58 up front means 58 surfaces to adapt and test before one checkout works.

2. **A commerce admin UI for the franchisor (cross-territory)**. This exists in `app/dashboard/commerce/*` but is scoped to franchise admin, not to a separate franchisor dashboard. Adding one would be Phase 17 or later.

3. **Subscription/metered billing**. The products model supports a `pricingModel` field, but the checkout flow does not handle recurrences. This is deferred to a v2 of the commerce plane.

4. **Full AI model marketplace**. Franchisees choose from franchisor-approved models only. Custom model fine-tuning is Phase 18+.

## What to Generate Next (Updated)

Three self-contained slices, matching the pattern from earlier. Each is one PowerShell block.

### Slice 1 — Contracts and Decisions (~15 files)
```
docs/22-commerce/ADR-*.md (10: 0001-0010)
contracts/commerce/openapi.yaml
contracts/commerce/events/*.json (7: order.created, order.paid, order.refunded, order.fulfilled, fulfillment.shipped, ai.pricing.reasoning, ai.agent.task.started, ai.agent.task.completed)
contracts/commerce/idempotency.md
contracts/commerce/ai-governance.md (NEW)
```
Answers the ten unasked questions. Unblocks slices 2 and 3.

### Slice 2 — Server Layer + AI Guards + AI Services (~15 files)
```
lib/server/commerce/{types,errors,tenant,pricing,idempotency,ai} with full implementations and tests
lib/server/commerce/ai/{agent,reasoning,voice,generative,governance}
```
Makes the structural claims verifiable by code review without a storefront.

### Slice 3 — Storefront + Adapters + AI Composed + Chaos Tests (~20 files)
```
app/shop/[tenant]/* routes (including /assistant, /concierge, /configure)
components/commerce/adapters/* (ProductGridAdapter, CartAdapter, CheckoutAdapter, AIConciergeAdapter, MultimodalPromptAdapter, GenerativeConfiguratorAdapter)
components/commerce/ai/* (pre-composed AI commerce patterns)
components/commerce/ui/* (2 shadcnstore block stubs)
tests/chaos/commerce/{royalty-consumer-down,ai-agent-down,reasoning-down}.test.ts
```
Delivers the behavioral claims.

Say which slice to generate (or "all three" and I'll produce them in one PowerShell block), and I'll write it.