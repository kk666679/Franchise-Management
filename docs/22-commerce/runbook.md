# Commerce Plane Runbook (v2 — Includes AI Operations)

## Webhook Failures

### Payment Webhook (Stripe)

- **Symptom**: `order.paid.v1` not emitted, orders stuck in `pending_payment`
- **Check**: `app/shop/[tenant]/api/webhook/payment/route.ts` logs
- **Fix**: 
  1. Verify Stripe webhook secret matches
  2. Check idempotency key collision (same `clientOpId` used twice)
  3. Replay from Stripe dashboard → `POST /api/webhook/payment` with same payload
  4. If `order.created.v1` missing, check outbox worker

### Fulfillment Webhook

- **Symptom**: Orders stuck in `paid`, no `fulfillment.shipped.v1`
- **Check**: Fulfillment provider webhook logs
- **Fix**: Same replay process as payment webhook

### AI Agent Webhook (NEW)

- **Symptom**: `ai.agent.task.completed.v1` not emitted, tasks stuck in `running`
- **Check**: Agent runner logs (`lib/server/commerce/ai/agent/runner.ts`)
- **Fix**:
  1. Check agent worker process health
  2. Verify model provider API keys valid
  3. Check tool execution failures in trace
  4. If L2 agent awaiting acknowledgment, franchisee must resume via dashboard
  5. Manual completion: `POST /api/commerce/ai/agent/complete` with `taskId` + result

## Stuck Orders

### Order Stuck in `pending`

- **Cause**: DB transaction failed, idempotency key exists but no order
- **Fix**: 
  ```sql
  -- Check idempotency key
  SELECT * FROM "IdempotencyKey" WHERE key = '...';
  -- If response exists, return it to client
  -- If not, delete key and let client retry
  ```

### Order Stuck in `paid` (No Fulfillment)

- **Cause**: Fulfillment agent failed or no inventory
- **Fix**:
  1. Check `AgentTask` for fulfillment-optimizer task
  2. If failed, review execution trace
  3. Manual fulfillment: create `Fulfillment` record + emit `fulfillment.shipped.v1`

### AI Agent Task Stuck in `running` (NEW)

- **Cause**: 
  - Model provider timeout
  - Tool execution error
  - L2 awaiting human acknowledgment (checkpoint)
  - Franchisee killed task
- **Fix**:
  1. Check `AgentTask.executionTrace` for failed step
  2. If checkpoint: franchisee must acknowledge via dashboard
  3. If model error: check provider status, fallback should activate
  4. If tool error: fix tool, resume task via `POST /api/commerce/ai/agent/resume`
  5. If killed: create new task with modified input

## Refunds

### Standard Refund (Customer Initiated)

1. Customer requests via `/account/orders/[orderId]` → creates `Return` with `status: requested`
2. Franchisee reviews in `/dashboard/commerce/returns` → approves → `status: inspection_pending`
3. Franchisee receives item → inspects → `status: approved` or `rejected`
4. If approved: refund webhook fires → `order.refunded.v1` emitted
5. Royalty consumer receives event → calculates royalty adjustment

### AI-Assisted Refund (NEW)

- Voice request via Assistant → creates `Return` with `source: voice`
- Agent (L1) drafts refund → franchisee confirms via `Confirmation` component
- Same inspection flow

## AI Agent Failures (NEW)

### Agent Worker Down

- **Symptom**: New tasks queue but never start; `Queue` component shows backlog
- **Check**: `pm2 list` or Kubernetes pod status for `commerce-ai-agent-worker`
- **Fix**: 
  1. Restart worker: `pm2 restart commerce-ai-agent-worker`
  2. Queued tasks auto-resume on startup
  3. Check `ai.agent.task.started.v1` emission resumes

### Model Provider Outage

- **Symptom**: Agent tasks fail at tool calls requiring model; `Reasoning` shows errors
- **Check**: Provider status page; `lib/server/commerce/ai/provider.ts` circuit breaker
- **Fix**:
  1. Fallback should activate automatically (see ADR-0006)
  2. If all fallbacks exhausted: tasks queue with `status: model_unavailable`
  3. Manual override: assign different model via `/dashboard/commerce/ai`
  4. When provider recovers: tasks auto-retry

### Reasoning Service Down

- **Symptom**: Checkout works but receipts show `reasoning.cached: true`; new orders lack reasoning traces
- **Check**: `lib/server/commerce/pricing/guard.ts` fallback logic
- **Fix**:
  1. Pricing guard uses cached reasoning for identical (variant, territory) pairs
  2. New combinations: guard passes but emits `reasoning.generated: false`
  3. Background job backfills reasoning when service recovers
  4. Monitor: `ai.pricing.reasoning.generated.v1` emission rate

### Prompt Template Safety Rejection

- **Symptom**: Franchisee saves template → rejected with safety score < 70
- **Check**: Safety report in `/dashboard/commerce/ai/prompts`
- **Fix**:
  1. Review failed checks: PII extraction, external calls, code execution, tool whitelist
  2. Modify template to pass checks
  3. If legitimate need for restricted pattern: franchisor approval required

### Cross-Tenant AI Access Attempt

- **Symptom**: `FORBIDDEN` errors in agent runner logs; audit log shows cross-tenant access
- **Check**: `AgentTask.tenantId` vs request context
- **Fix**:
  1. Immediate: Block IP/user agent
  2. Investigate: Compromised credentials? Malicious franchisee?
  3. Rotate API keys for affected tenant
  4. Review RLS policies on `AgentTask`, `PromptTemplate`

## Multimodal Data Issues (NEW)

### Voice STT Failing

- **Symptom**: `SpeechInput` shows "Transcription failed"; voice commerce unusable
- **Check**: STT provider API status; `lib/server/commerce/ai/voice/processor.ts`
- **Fix**:
  1. Fallback to secondary STT provider (ADR-0006)
  2. If all down: disable voice features, show toast "Voice temporarily unavailable"
  3. Text input still works

### Vision Processing Failing

- **Symptom**: Receipt OCR / product photo search returns errors
- **Check**: Vision provider status; `lib/server/commerce/ai/vision/processor.ts`
- **Fix**: Same as STT — fallback chain, graceful degradation

### Storage Full / Retention Not Working

- **Symptom**: Multimodal storage costs spike; old data not purged
- **Check**: `ai.multimodal.data.purged.v1` events; cron job logs
- **Fix**:
  1. Manual purge: `POST /api/commerce/ai/multimodal/purge` with date range
  2. Fix cron schedule
  3. Alert on storage > 80% capacity

## Chaos Test Verification

Run before any production deploy:

```bash
# 1. Kill royalty consumer, verify checkout p99 unchanged
npm run chaos:royalty-down

# 2. Kill commerce DB, verify royalty jobs continue
npm run chaos:commerce-db-down

# 3. Kill AI agent worker, verify checkout continues, tasks queue
npm run chaos:ai-agent-down

# 4. Kill reasoning service, verify prices validate, receipts show cached
npm run chaos:reasoning-down

# 5. Kill all model providers, verify fallback chain activates
npm run chaos:model-providers-down

# 6. Simulate franchisee killing L2 agent at checkpoint
npm run chaos:agent-kill-checkpoint
```

All chaos tests must pass (p99 within 20%, error rate 0) before deploy.

## Monitoring Alerts

| Alert | Threshold | Action |
|---|---|---|
| `checkout_p99_ms` | > 2000ms | Page on-call |
| `checkout_error_rate` | > 0.1% | Page on-call |
| `royalty_consumer_lag` | > 100 events | Investigate |
| `ai_agent_queue_depth` | > 50 tasks | Scale workers |
| `ai_agent_failure_rate` | > 5% | Check model providers |
| `reasoning_cache_hit_rate` | < 80% | Check reasoning service |
| `multimodal_storage_gb` | > 100GB | Trigger purge |
| `prompt_safety_rejection_rate` | > 10% | Review template changes |
| `cross_tenant_ai_access_attempts` | > 0 | Security incident |

## Useful Commands

```bash
# View recent AI agent tasks
psql -c "SELECT * FROM \"AgentTask\" ORDER BY \"createdAt\" DESC LIMIT 20;"

# Check outbox for stuck events
psql -c "SELECT * FROM \"OutboxEntry\" WHERE status = 'pending' ORDER BY \"createdAt\" ASC;"

# View pricing reasoning for order
psql -c "SELECT * FROM \"PricingReasoning\" WHERE \"orderId\" = '...';"

# Check multimodal storage usage
psql -c "SELECT pg_size_pretty(pg_total_relation_size('MultimodalData'));"

# Replay event from outbox
curl -X POST localhost:3000/api/internal/outbox/replay -d '{"eventId": "..."}'

# Resume stuck agent task
curl -X POST localhost:3000/api/commerce/ai/agent/resume -d '{"taskId": "..."}'

# Force purge multimodal data
curl -X POST localhost:3000/api/commerce/ai/multimodal/purge -d '{"olderThanDays": 30}'
```