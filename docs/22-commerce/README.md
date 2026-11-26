# Commerce Plane

The commerce plane (catalog, storefront, cart, checkout, payments, fulfillment, returns, **AI concierge, multimodal assistant, generative UI**) is a separate system from the control plane (franchise management). The two planes communicate only through a versioned, idempotent, replayable event bus.

## Directory layout

- `docs/22-commerce/` — ADRs (10), architecture, block inventory, runbook
- `contracts/commerce/` — OpenAPI, event schemas (8), idempotency semantics, AI governance
- `app/shop/[tenant]/*` — customer-facing storefront + **AI routes (/assistant, /concierge, /configure)**
- `app/dashboard/commerce/*` — franchise-admin commerce UI + **AI monitoring, integrations**
- `components/commerce/*` — adapters around vendored shadcnstore blocks
- `components/commerce/ai/*` — **pre-composed AI commerce patterns**
- `components/ai-elements/*` — **AI interaction primitives (Radix-based, vendor library)**
- `lib/server/commerce/*` — commerce services, pricing guard, outbox, events
- `lib/server/commerce/ai/*` — **AI services: agent, reasoning, voice, generative, governance**
- `lib/client/commerce/*` — client-side cart/offline logic + **AI hooks**
- `prisma/commerce/` — commerce-only schema and migrations (+ AI tables)
- `tests/` — unit, integration, chaos, e2e, a11y tests for commerce + **AI**

## Boundaries

- Two databases, not one. The commerce plane has its own schema; it shares `tenantId` and `territoryId` with the control plane but does not foreign-key into franchise tables.
- Cross-plane reads go through the API or the event log — never through a join.
- Pages never import `components/commerce/ui/*` or `components/ai-elements/*` directly; they import adapters or AI-composed components.
- A fail-stop in either plane cannot raise p99 or error rate in the other. Proven by chaos test.
- **AI services are decoupled from checkout — reasoning, agents, and generative UI fail independently.**

## ADRs

ADR-0001 through ADR-0010 must be accepted before any commerce code is written.

| ADR | Title | Status |
|-----|-------|--------|
| ADR-0001 | Merchant of Record | Accepted |
| ADR-0002 | Tax Model | Accepted |
| ADR-0003 | Inventory Model | Accepted |
| ADR-0004 | Returns Model | Accepted |
| ADR-0005 | Primitive Library Strategy | Accepted |
| **ADR-0006** | **AI Model Strategy** | **Pending** |
| **ADR-0007** | **Agent Autonomy Levels** | **Pending** |
| **ADR-0008** | **Prompt Template Governance** | **Pending** |
| **ADR-0009** | **Multimodal Data Handling** | **Pending** |
| **ADR-0010** | **AI Explainability Requirements** | **Pending** |

## AI Commerce Capabilities (v1)

### Agentic Concierge
Autonomous order processing, inventory reconciliation, pricing optimization with transparent reasoning via `Reasoning` + `ChainOfThought`.

### Multimodal Assistant
Voice commerce ("Reorder my usual"), photo-based product search, receipt OCR for returns, screen-capture checkout help.

### Generative Configurator
Live product configuration with AI-generated variants, visual React Flow canvas, instant preview via `WebPreview`.

### Explainable Commerce
Full pricing audit trail with tax regulation citations, franchise agreement clause references, royalty calculation transparency.

### Collaborative Cart
Multi-user cart editing with Git-like branching via `MessageBranch`, franchisee + customer co-browsing.

### Developer Experience
Webhook debugger (`Terminal`), event schema explorer (`SchemaDisplay`), integration test runner (`TestResults`), API playground.