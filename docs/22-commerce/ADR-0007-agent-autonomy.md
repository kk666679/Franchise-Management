# ADR-0007: Agent Autonomy Levels

- Status: Pending
- Date: 2026-11-26
- Related paths: `lib/server/commerce/ai/agent/runner.ts`, `lib/server/commerce/ai/agent/tools/*`, `app/shop/[tenant]/concierge/page.tsx`, `app/dashboard/commerce/ai/agents/page.tsx`

## Context

How much autonomy do commerce AI agents have? This determines which actions require human approval, which run fully autonomously, and the audit trail requirements.

| Level | Description | Example Actions | Approval Required |
|---|---|---|---|
| L0: Advisory | Agent suggests, human decides | "Consider raising price 5%" | Human executes |
| L1: Assisted | Agent prepares, human confirms | Draft refund, generate shipping label | One-click confirm |
| L2: Supervised | Agent executes, human can interrupt | Reserve inventory, split shipment | Pause/stop button |
| L3: Autonomous | Agent executes independently | Auto-reorder stock, optimize fulfillment | Post-execution audit |
| L4: Self-improving | Agent modifies own prompts/tools | Learn from failures, optimize prompts | Governance review |

## Decision

**L2 (Supervised) for v1, with L1 for payments/refunds.** Core commerce agents (fulfillment optimizer, pricing optimizer, inventory reconciler) run at L2 — they execute but stream reasoning to the franchisee dashboard with a kill switch. Payment/refund agents stay at L1. No L3/L4 in v1.

## Consequences

- `lib/server/commerce/ai/agent/runner.ts` implements supervision protocol: stream steps → await acknowledgment → execute
- `AgentTools` from ai-elements shows real-time tool execution with pause/stop
- `Plan` component displays execution plan with checkpoints requiring acknowledgment
- All L2 actions emit `ai.agent.task.started.v1` and `ai.agent.task.completed.v1` with full reasoning
- Franchisee dashboard (`app/dashboard/commerce/ai/agents/page.tsx`) shows active agents with kill switches
- Audit log captures every tool call, input, output, and human intervention
- L1 actions (payments/refunds) use `Confirmation` component from ai-elements before execution