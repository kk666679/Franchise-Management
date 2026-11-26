# Commerce Plane Event Contracts

## Overview

All cross-plane and intra-plane communication happens via versioned, idempotent, replayable CloudEvents. Events are emitted to the event bus via the transactional outbox pattern (same as POS).

## Event Categories

### Core Commerce Events (Plane Boundary)

| Event | Source | Consumers | Idempotency Key |
|---|---|---|---|
| `order.created.v1` | `/commerce/orders` | Royalty, Audit, Inventory, AI Agent | `clientOpId` |
| `order.paid.v1` | `/commerce/payments` | Royalty, Fulfillment, Accounting | `paymentId` |
| `order.refunded.v1` | `/commerce/returns` | Royalty, Accounting, Inventory | `returnId` |
| `order.fulfilled.v1` | `/commerce/fulfillment` | Royalty, Customer Notification | `fulfillmentId` |
| `fulfillment.shipped.v1` | `/commerce/fulfillment` | Tracking, Customer Notification | `trackingRef` |

### AI Commerce Events (Intra-Plane + Audit)

| Event | Source | Consumers | Idempotency Key |
|---|---|---|---|
| `ai.pricing.reasoning.generated.v1` | `/commerce/pricing` | Audit, Receipts, Franchisee Dashboard | `orderId` |
| `ai.agent.task.started.v1` | `/commerce/ai/agent` | Franchisee Dashboard, Audit, Control Plane | `taskId` |
| `ai.agent.task.completed.v1` | `/commerce/ai/agent` | Franchisee Dashboard, Audit, Control Plane, Fulfillment | `taskId` |
| `ai.agent.task.stopped.v1` | `/commerce/ai/agent` | Franchisee Dashboard, Audit, Control Plane | `taskId` |
| `ai.model.assigned.v1` | `/commerce/ai/governance` | Audit, Model Gateway, Franchisee Dashboard | `configId` |
| `ai.prompt.updated.v1` | `/commerce/ai/governance` | Audit, Agent Runner, Franchisee Dashboard | `templateId` |
| `ai.multimodal.data.purged.v1` | `/commerce/ai/multimodal` | Audit, Compliance, Storage Monitoring | `purgeBatchId` |

## Event Schemas

All schemas are in `contracts/commerce/events/*.json` and follow CloudEvents 1.0 spec.

### Order Events

#### order.created.v1
```json
{
  "type": "com.franchise.commerce.order.created.v1",
  "source": "/commerce/orders",
  "data": {
    "orderId": "uuid",
    "tenantId": "uuid",
    "franchiseId": "uuid",
    "territoryId": "uuid",
    "customerId": "uuid | null",
    "totalMinor": 12500,
    "currency": "USD",
    "lines": [{ "sku": "ETH-001", "qty": 2, "unitPriceMinor": 6250 }],
    "createdAt": "2026-11-26T10:30:00Z"
  }
}
```

#### order.paid.v1
```json
{
  "type": "com.franchise.commerce.order.paid.v1",
  "source": "/commerce/payments",
  "data": {
    "orderId": "uuid",
    "paymentId": "uuid",
    "amountMinor": 12500,
    "currency": "USD",
    "providerRef": "pi_...",
    "paidAt": "2026-11-26T10:30:05Z"
  }
}
```

#### order.refunded.v1
```json
{
  "type": "com.franchise.commerce.order.refunded.v1",
  "source": "/commerce/returns",
  "data": {
    "orderId": "uuid",
    "returnId": "uuid",
    "refundMinor": 6250,
    "currency": "USD",
    "reason": "customer_request",
    "refundResponsibility": "franchisee",
    "refundedAt": "2026-11-26T10:30:00Z"
  }
}
```

#### order.fulfilled.v1
```json
{
  "type": "com.franchise.commerce.order.fulfilled.v1",
  "source": "/commerce/fulfillment",
  "data": {
    "orderId": "uuid",
    "fulfillmentId": "uuid",
    "shipments": [
      { "shipmentId": "uuid", "carrier": "UPS", "trackingRef": "1Z999...", "items": [{ "sku": "ETH-001", "qty": 2 }] }
    ],
    "fulfilledAt": "2026-11-26T10:30:00Z"
  }
}
```

#### fulfillment.shipped.v1
```json
{
  "type": "com.franchise.commerce.fulfillment.shipped.v1",
  "source": "/commerce/fulfillment",
  "data": {
    "fulfillmentId": "uuid",
    "shipmentId": "uuid",
    "carrier": "UPS",
    "trackingRef": "1Z999...",
    "shippedAt": "2026-11-26T10:30:00Z"
  }
}
```

### AI Events

#### ai.pricing.reasoning.generated.v1
```json
{
  "type": "com.franchise.commerce.ai.pricing.reasoning.generated.v1",
  "source": "/commerce/pricing",
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

#### ai.agent.task.started.v1
```json
{
  "type": "com.franchise.commerce.ai.agent.task.started.v1",
  "source": "/commerce/ai/agent",
  "data": {
    "taskId": "uuid",
    "agentName": "fulfillment-optimizer",
    "tenantId": "uuid",
    "territoryId": "uuid",
    "autonomyLevel": "L2",
    "input": {
      "orderId": "uuid",
      "objective": "minimize_split_shipments",
      "constraints": ["franchisee_payout_optimization", "delivery_sla_24h"]
    },
    "plan": [
      { "step": 1, "tool": "check_inventory", "args": { "territoryId": "..." }, "checkpoint": false },
      { "step": 2, "tool": "calculate_shipping", "args": { "destinations": [...] }, "checkpoint": false },
      { "step": 3, "tool": "reserve_inventory", "args": { "items": [...] }, "checkpoint": true },
      { "step": 4, "tool": "emit_fulfillment", "args": { "shipments": [...] }, "checkpoint": false }
    ],
    "promptTemplateVersion": "fulfillment-optimizer@v2.1.0",
    "model": "gpt-4o"
  }
}
```

#### ai.agent.task.completed.v1
```json
{
  "type": "com.franchise.commerce.ai.agent.task.completed.v1",
  "source": "/commerce/ai/agent",
  "data": {
    "taskId": "uuid",
    "agentName": "fulfillment-optimizer",
    "status": "completed",
    "result": {
      "shipments": [
        { "territoryId": "uuid", "items": [{ "sku": "ETH-001", "qty": 2 }], "carrier": "UPS", "trackingRef": "1Z999..." }
      ],
      "payoutOptimization": { "franchiseeId": "uuid", "amountMinor": 12500 }
    },
    "reasoning": "Single-territory fulfillment optimal. Cross-territory split would add $3.50 shipping per unit.",
    "executionTrace": [
      { "step": 1, "tool": "check_inventory", "input": { "territoryId": "...", "skus": ["ETH-001"] }, "output": { "ETH-001": { "available": 50, "reserved": 5 } }, "durationMs": 120, "status": "completed" },
      { "step": 2, "tool": "calculate_shipping", "input": { "destinations": [{ "territoryId": "...", "zip": "78701" }] }, "output": { "UPS": 850, "FedEx": 920 }, "durationMs": 340, "status": "completed" },
      { "step": 3, "tool": "reserve_inventory", "input": { "items": [{ "sku": "ETH-001", "qty": 2, "territoryId": "..." }] }, "output": { "reservationId": "res_abc123" }, "durationMs": 85, "status": "completed", "humanAcknowledged": true },
      { "step": 4, "tool": "emit_fulfillment", "input": { "shipments": [...] }, "output": { "fulfillmentId": "ful_xyz789" }, "durationMs": 45, "status": "completed" }
    ],
    "durationMs": 4200,
    "model": "gpt-4o",
    "tokensUsed": { "input": 1250, "output": 890 }
  }
}
```

#### ai.agent.task.stopped.v1
```json
{
  "type": "com.franchise.commerce.ai.agent.task.stopped.v1",
  "source": "/commerce/ai/agent",
  "data": {
    "taskId": "uuid",
    "agentName": "fulfillment-optimizer",
    "status": "stopped",
    "stoppedAtStep": 3,
    "stoppedBy": "user_franchisee_123",
    "stopReason": "Franchisee reviewed inventory reservation and chose to modify quantities",
    "partialResult": {
      "inventoryChecked": true,
      "shippingCalculated": true,
      "inventoryReserved": false
    },
    "executionTrace": [
      { "step": 1, "tool": "check_inventory", "input": { "territoryId": "...", "skus": ["ETH-001"] }, "output": { "ETH-001": { "available": 50, "reserved": 5 } }, "durationMs": 120, "status": "completed" },
      { "step": 2, "tool": "calculate_shipping", "input": { "destinations": [{ "territoryId": "...", "zip": "78701" }] }, "output": { "UPS": 850, "FedEx": 920 }, "durationMs": 340, "status": "completed" },
      { "step": 3, "tool": "reserve_inventory", "input": { "items": [{ "sku": "ETH-001", "qty": 2, "territoryId": "..." }] }, "output": null, "durationMs": 0, "status": "stopped" }
    ],
    "durationMs": 2100,
    "model": "gpt-4o"
  }
}
```

#### ai.model.assigned.v1
```json
{
  "type": "com.franchise.commerce.ai.model.assigned.v1",
  "source": "/commerce/ai/governance",
  "data": {
    "configId": "uuid",
    "tenantId": "uuid",
    "territoryId": "uuid",
    "assignments": {
      "reasoning": { "primary": "gpt-4o", "fallback": ["claude-3-5-sonnet", "nemotron-3-ultra"] },
      "voice_stt": { "primary": "nova-2", "fallback": ["whisper-large-v3"] },
      "voice_tts": { "primary": "tts-1-hd", "fallback": ["aura-asteria"] },
      "vision": { "primary": "gpt-4o", "fallback": ["claude-3-5-sonnet"] },
      "embeddings": { "primary": "text-embedding-3-large", "fallback": ["text-embedding-3-small"] }
    },
    "updatedBy": "user_franchisor_admin_001",
    "previousAssignments": { ... },
    "reason": "Added Nemotron 3 Ultra as tertiary fallback for cost optimization"
  }
}
```

#### ai.prompt.updated.v1
```json
{
  "type": "com.franchise.commerce.ai.prompt.updated.v1",
  "source": "/commerce/ai/governance",
  "data": {
    "templateId": "uuid",
    "agentType": "fulfillment-optimizer",
    "tenantId": "uuid",
    "territoryId": "uuid",
    "version": "2.1.0",
    "isFranchisorBase": false,
    "inheritanceChain": [
      "prompt_fulfillment_optimizer_base_v2.0.0",
      "prompt_fulfillment_optimizer_franchisee_acme_v2.0.0",
      "prompt_fulfillment_optimizer_territory_tx_v2.1.0"
    ],
    "changes": {
      "systemPrompt": "added territory-specific carrier preferences",
      "toolDefinitions": "added reserve_inventory checkpoint requirement",
      "variables": "added carrier_preference variable"
    },
    "safetyScore": 92,
    "updatedBy": "user_franchisee_acme_001",
    "previousVersion": "2.0.0"
  }
}
```

#### ai.multimodal.data.purged.v1
```json
{
  "type": "com.franchise.commerce.ai.multimodal.data.purged.v1",
  "source": "/commerce/ai/multimodal",
  "data": {
    "purgeBatchId": "uuid",
    "trigger": "retention_policy",
    "tenantId": "uuid",
    "territoryId": "uuid",
    "purgedItems": [
      { "type": "voice_transcript", "count": 147, "oldestDate": "2026-10-26", "newestDate": "2026-11-25" },
      { "type": "image_original", "count": 23, "oldestDate": "2026-08-28", "newestDate": "2026-10-15" },
      { "type": "vision_analysis", "count": 23, "oldestDate": "2026-10-26", "newestDate": "2026-11-25" }
    ],
    "totalBytesFreed": 204857600,
    "gdprRequestsProcessed": 0
  }
}
```

## Consumer Contracts

### Royalty Service
- Subscribes to: `order.created.v1`, `order.paid.v1`, `order.refunded.v1`, `order.fulfilled.v1`
- Must be idempotent on `idempotencykey`
- Must NOT block on schema validation failure — log and dead-letter
- Must emit `royalty.calculated.v1` back to control plane

### Audit Service
- Subscribes to: ALL events
- Immutable event store for compliance
- Powers franchisee dashboard and regulator exports

### Fulfillment Service
- Subscribes to: `order.paid.v1`, `ai.agent.task.completed.v1` (when agent emits fulfillment)
- Triggers physical fulfillment workflow

### AI Agent Runner
- Subscribes to: `order.created.v1` (triggers auto-fulfillment agent if enabled)
- Publishes: `ai.agent.task.started.v1`, `ai.agent.task.completed.v1`, `ai.agent.task.stopped.v1`

### Franchisee Dashboard
- Subscribes to: `ai.agent.task.*`, `ai.pricing.reasoning.generated.v1`, `ai.model.assigned.v1`, `ai.prompt.updated.v1`
- Real-time updates via SSE/WebSocket

## Versioning Rules

1. **Minor changes** (additive fields): Same version, consumers must tolerate unknown fields
2. **Breaking changes** (rename, remove, type change): New version `v2`, run both in parallel during migration
3. **Event type** format: `com.franchise.commerce.{domain}.{event}.v{version}`
4. **Source** format: `/{plane}/{domain}` (e.g., `/commerce/orders`, `/commerce/ai/agent`)

## Replay Semantics

- Outbox retains events for 30 days
- Consumers track last processed event ID per event type
- Replay endpoint: `POST /api/internal/eventbus/replay` with `{ eventType, fromEventId, toEventId }`
- AI agent events include full reasoning traces for replay debugging
- Pricing reasoning events enable receipt regeneration

## Idempotency

All events carry `idempotencykey`:
- Core commerce: `clientOpId` (cart), `paymentId`, `returnId`, `fulfillmentId`, `trackingRef`
- AI: `orderId`, `taskId`, `configId`, `templateId`, `purgeBatchId`

Consumers MUST deduplicate on this key. The outbox guarantees at-least-once delivery.