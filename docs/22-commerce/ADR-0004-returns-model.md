ADR-0004: Returns, RMA, Inspection & Refund Responsibility Model
Status: Accepted
Date: 2026-11-26
Domain: Commerce / Returns / Refunds
Decision Owners: Commerce Architecture
Related Paths:
lib/server/commerce/returns/service.ts
lib/server/commerce/returns/refund.ts
lib/server/commerce/returns/types.ts
lib/server/commerce/returns/validation.ts
lib/server/commerce/returns/inspection.ts
lib/server/commerce/returns/responsibility.ts
lib/server/commerce/returns/rma.ts
lib/server/commerce/returns/audit.ts
app/dashboard/commerce/returns/page.tsx
app/dashboard/commerce/returns/[returnId]/page.tsx
app/dashboard/commerce/returns/components/
app/account/orders/[orderId]/returns/page.tsx
1. Context

The commerce platform requires a consistent returns and refund model across customers, franchisees, and franchisors.

The system must establish:

Who is authorized to initiate a return?
Which entity is responsible for issuing the refund?
Which entity absorbs the financial cost?
When can a refund be approved and executed?
Is physical inspection required?
How are returned items tracked?
How are disputes, partial returns, and rejected returns handled?
How are refund responsibilities determined across franchise agreements?

The returns model must preserve the platform's merchant-of-record structure while supporting different commercial agreements between franchisees and franchisors.

1.1 Business requirements
Area	Requirement
Customer initiation	Customers initiate returns through their account
Administrative initiation	Franchisees initiate returns through the admin dashboard
Merchant of Record	Franchisee remains the MoR
Refund execution	Franchisee executes the customer refund
Financial responsibility	Configurable per contract
Inspection	Mandatory before refund completion
RMA	Required for every physical return
Partial returns	Supported
Rejected returns	Supported with documented reasons
Auditability	Every material transition is recorded
Notifications	Customer and relevant operators receive lifecycle updates
2. Decision

The platform adopts a centralized, contract-aware Return Management System (RMS).

All returns must follow a controlled Return Merchandise Authorization (RMA) lifecycle.

The franchisee remains the Merchant of Record and is responsible for executing customer refunds.

The financial burden of a refund is determined by the applicable contract's refundResponsibility configuration.

Physical inspection is mandatory before refund execution for physical merchandise.

The system must distinguish between:

Return authorization
Physical item receipt
Inspection
Refund approval
Refund execution
Financial settlement

These are separate business events and must not be treated as one operation.

3. Return Initiation

Returns can originate from two authorized sources.

3.1 Customer initiation

Customers initiate returns through their authenticated account.

Requirements:

Customer must own the original order.
Order must belong to the relevant franchisee.
Return window must be valid.
Returned quantities must not exceed eligible purchased quantities.
Items must satisfy the applicable return policy.
A return reason is required.
Supporting evidence may be attached.
The customer receives an RMA reference after authorization.
3.2 Franchisee initiation

Franchisees can initiate returns through the administrative dashboard.

Permitted use cases:

Customer service-assisted returns.
Damaged shipment resolution.
Delivery errors.
Product quality issues.
Manual return authorization.
Exceptional policy-approved returns.

Administrative initiation must record:

Initiating franchisee.
Authorized operator.
Reason for initiation.
Original order.
Affected order items.
Approval justification when overriding normal policy.
3.3 Authorization boundaries
Actor	Permissions
Customer	Request return for own eligible order
Franchisee operator	Create and manage returns for assigned franchise
Franchisee manager	Approve permitted exceptions
Franchisor	View and manage contract-level oversight
Platform administrator	Resolve exceptional platform-level cases

Franchisor access does not automatically grant authority to issue customer refunds.

4. Merchant of Record and Refund Ownership

The franchisee is the Merchant of Record.

Consequently:

The franchisee owns the customer refund obligation.
The franchisee executes the refund through the original payment provider or supported payment method.
The franchisee's payment integration is responsible for refund execution.
The platform coordinates the workflow and records the outcome.
Franchisor participation is limited to the financial responsibility agreed in the applicable contract.

The platform must never assume that financial responsibility and refund execution are the same thing.

Important distinction:

The franchisee can execute a refund while the franchisor absorbs all or part of its financial cost through an internal settlement or reimbursement process.

5. Contract-Based Refund Responsibility

The refundResponsibility field determines which party absorbs the financial cost.

Supported responsibility modes:

Mode	Description
FRANCHISEE	Franchisee absorbs the full refund cost
FRANCHISOR	Franchisor absorbs the full refund cost
SPLIT	Cost is allocated between both parties
5.1 Contract configuration

The contract is the source of truth.

Example:

ts
type RefundResponsibility =
  | {
      type: "FRANCHISEE";
    }
  | {
      type: "FRANCHISOR";
    }
  | {
      type: "SPLIT";
      franchiseePercentage: number;
      franchisorPercentage: number;
    };


The split percentages must total exactly 100.

Example:

ts
const refundResponsibility = {
  type: "SPLIT",
  franchiseePercentage: 60,
  franchisorPercentage: 40,
};

5.2 Snapshot responsibility at authorization

The return must preserve the contract responsibility configuration applicable when the return is authorized.

This prevents subsequent contract changes from silently changing an existing return's financial allocation.

ts
interface RefundResponsibilitySnapshot {
  type: "FRANCHISEE" | "FRANCHISOR" | "SPLIT";

  franchiseePercentage?: number;
  franchisorPercentage?: number;

  contractId: string;
  contractVersion: number;

  capturedAt: Date;
}


If an authorized return requires an exceptional contractual override, the override must be explicitly approved and audited.

5.3 Financial allocation

For a refund amount of RM100:

Responsibility	Franchisee	Franchisor
Franchisee	RM100	RM0
Franchisor	RM0	RM100
Split 60/40	RM60	RM40

Calculations must use integer minor currency units to avoid floating-point errors.

For MYR, amounts are calculated in sen.

Rounding adjustments must be assigned deterministically so that:

franchiseeShare + franchisorShare = totalAllocatedRefundCost

Refund allocation is an internal financial responsibility calculation. It does not change which party executes the customer's refund.

6. Return Domain Model

The Return aggregate represents the complete lifecycle of a customer's return request.

6.1 Return entity
ts
interface Return {
  id: string;
  returnNumber: string;

  orderId: string;
  customerId: string;

  franchiseeId: string;
  franchisorId?: string;

  initiatedBy: "CUSTOMER" | "FRANCHISEE";
  initiatedByUserId: string;

  status: ReturnStatus;

  reason: ReturnReason;
  customerNotes?: string;

  items: ReturnItem[];

  rma?: RMA;

  inspection?: ReturnInspection;

  refund?: Refund;

  refundResponsibility: RefundResponsibilitySnapshot;

  currency: string;

  requestedRefundAmount: number;
  approvedRefundAmount?: number;

  rejectionReason?: string;

  createdAt: Date;
  updatedAt: Date;
  authorizedAt?: Date;
  completedAt?: Date;
}

6.2 Return item
ts
interface ReturnItem {
  id: string;
  orderItemId: string;
  productId: string;

  quantityPurchased: number;
  quantityPreviouslyReturned: number;
  quantityRequested: number;
  quantityApproved?: number;

  unitPrice: number;

  reason: ReturnReason;
  condition?: ItemCondition;
}


Quantity validation must prevent duplicate returns and quantities exceeding the remaining eligible order quantity.

6.3 Return reasons
ts
type ReturnReason =
  | "DAMAGED"
  | "DEFECTIVE"
  | "WRONG_ITEM"
  | "NOT_AS_DESCRIBED"
  | "CHANGED_MIND"
  | "SIZE_OR_FIT"
  | "MISSING_PARTS"
  | "DELIVERY_ISSUE"
  | "OTHER";

6.4 Item condition
ts
type ItemCondition =
  | "UNOPENED"
  | "OPENED"
  | "USED"
  | "DAMAGED"
  | "DEFECTIVE"
  | "MISSING_PARTS";

7. Return State Machine

All return status changes must occur through domain services.

ts
type ReturnStatus =
  | "REQUESTED"
  | "AUTHORIZED"
  | "AWAITING_SHIPMENT"
  | "IN_TRANSIT"
  | "RECEIVED"
  | "INSPECTION_IN_PROGRESS"
  | "INSPECTION_PASSED"
  | "INSPECTION_FAILED"
  | "REFUND_APPROVED"
  | "REFUND_PROCESSING"
  | "REFUNDED"
  | "REJECTED"
  | "CANCELLED";

7.1 Lifecycle
text
REQUESTED
    |
    v
AUTHORIZED
    |
    v
AWAITING_SHIPMENT
    |
    v
IN_TRANSIT
    |
    v
RECEIVED
    |
    v
INSPECTION_IN_PROGRESS
    |
    +--------------------+
    |                    |
    v                    v
INSPECTION_PASSED    INSPECTION_FAILED
    |                    |
    v                    v
REFUND_APPROVED       REJECTED
    |
    v
REFUND_PROCESSING
    |
    v
REFUNDED


Cancellation is permitted only at eligible stages and subject to return policy.

7.2 Transition rules
Current status	Allowed next status
REQUESTED	AUTHORIZED, REJECTED, CANCELLED
AUTHORIZED	AWAITING_SHIPMENT, CANCELLED
AWAITING_SHIPMENT	IN_TRANSIT, CANCELLED
IN_TRANSIT	RECEIVED
RECEIVED	INSPECTION_IN_PROGRESS
INSPECTION_IN_PROGRESS	INSPECTION_PASSED, INSPECTION_FAILED
INSPECTION_PASSED	REFUND_APPROVED
INSPECTION_FAILED	REJECTED
REFUND_APPROVED	REFUND_PROCESSING
REFUND_PROCESSING	REFUNDED

Exceptional transitions require explicit authorization and audit records.

A return must never transition directly from REQUESTED to REFUNDED.

8. RMA Management

Every physical return requires a unique RMA.

8.1 RMA entity
ts
interface RMA {
  id: string;
  rmaNumber: string;

  returnId: string;

  status:
    | "ISSUED"
    | "AWAITING_PICKUP"
    | "IN_TRANSIT"
    | "DELIVERED"
    | "CLOSED";

  carrier?: string;
  trackingNumber?: string;

  shippingMethod?: string;

  issuedAt: Date;
  receivedAt?: Date;
  closedAt?: Date;
}

8.2 RMA requirements
Generate a unique, human-readable RMA number.
Associate the RMA with exactly one return.
Provide the customer with return instructions.
Support carrier and tracking information.
Track item receipt.
Record the receiving location.
Preserve delivery and receipt timestamps.
Prevent unauthorized reuse of an RMA.

The RMA must be available to customers and authorized franchisee operators.

9. Mandatory Inspection

Inspection is a mandatory control before physical merchandise refunds are executed.

9.1 Inspection requirements

The receiving franchisee or authorized inspection operator must verify:

Correct product received.
Correct quantity received.
Product condition.
Physical damage.
Missing accessories or components.
Product serial number, where applicable.
Return reason validity.
Eligibility under the applicable return policy.
9.2 Inspection entity
ts
interface ReturnInspection {
  id: string;
  returnId: string;

  inspectedBy: string;

  outcome:
    | "PASSED"
    | "FAILED"
    | "PARTIAL";

  findings: InspectionFinding[];

  notes?: string;

  evidenceUrls: string[];

  inspectedAt: Date;
}

ts
interface InspectionFinding {
  returnItemId: string;

  quantityReceived: number;
  quantityAccepted: number;
  quantityRejected: number;

  condition: ItemCondition;

  reason?: string;
}

9.3 Inspection rules
Inspection must be performed by an authorized operator.
Inspection evidence must be retained.
Findings must be linked to individual return items.
Partial inspection results must be supported.
Failed inspections must include documented reasons.
Inspection records must be immutable after finalization, with corrections recorded as new audit events.
9.4 Refund gate

The refund service must verify that:

The return is authorized.
The physical goods have been received.
Inspection has been finalized.
The relevant quantities have been accepted.
The refund amount has been calculated.
Refund responsibility has been resolved.
The franchisee is authorized to execute the refund.

No physical merchandise refund can proceed without satisfying these conditions.

10. Refund Domain Model
10.1 Refund entity
ts
interface Refund {
  id: string;
  refundNumber: string;

  returnId: string;
  orderId: string;

  franchiseeId: string;

  paymentTransactionId: string;

  status:
    | "PENDING"
    | "APPROVED"
    | "PROCESSING"
    | "SUCCEEDED"
    | "FAILED";

  amount: number;
  currency: string;

  paymentProvider?: string;
  providerRefundId?: string;

  responsibilitySnapshot: RefundResponsibilitySnapshot;

  franchiseeCost: number;
  franchisorCost: number;

  failureReason?: string;

  idempotencyKey: string;

  createdAt: Date;
  processedAt?: Date;
}

10.2 Refund execution

The refund service must:

Validate inspection completion.
Validate approved quantities.
Recalculate the eligible refund amount.
Verify remaining refundable order balance.
Confirm the original payment transaction.
Resolve the franchisee's payment provider.
Create a refund execution record.
Submit the refund using an idempotency key.
Persist the provider response.
Reconcile asynchronous provider results.
Publish refund events only after confirmed provider success.

The platform must not report a refund as successful merely because the payment provider accepted an initial request.

PROCESSING and SUCCEEDED must remain separate states.

10.3 Partial refunds

The system must support:

Partial quantity returns.
Multiple return items.
Partial item acceptance.
Partial refunds.
Multiple authorized returns against the same order, subject to the remaining refundable balance.

The aggregate refunded amount must never exceed the eligible captured payment amount.

Shipping, discounts, taxes, and other adjustments must follow the original order's applicable refund policy.

11. Refund Responsibility Resolution

Create a dedicated responsibility service.

Path:

lib/server/commerce/returns/responsibility.ts

Responsibilities:

Retrieve the applicable contract.
Resolve the contract version.
Validate responsibility configuration.
Snapshot responsibility at return authorization.
Calculate franchisee allocation.
Calculate franchisor allocation.
Produce settlement allocation records.
Support approved exceptions.
Prevent silent responsibility changes.

Suggested API:

ts
export async function resolveRefundResponsibility(
  franchiseeId: string,
  orderId: string
): Promise<RefundResponsibilitySnapshot>;

export function calculateRefundAllocation(
  amount: number,
  responsibility: RefundResponsibilitySnapshot
): {
  franchiseeCost: number;
  franchisorCost: number;
};


Contract resolution must be deterministic and auditable.

12. Refund Webhook and Event Architecture

Refund events must be emitted only after the relevant business operation reaches its confirmed state.

12.1 Internal domain events
ts
type ReturnEvent =
  | "return.requested"
  | "return.authorized"
  | "return.rejected"
  | "return.shipped"
  | "return.received"
  | "return.inspection.started"
  | "return.inspection.completed"
  | "return.refund.approved"
  | "return.refund.processing"
  | "return.refund.succeeded"
  | "return.refund.failed"
  | "return.completed";

12.2 Event ordering
text
return.requested
       |
return.authorized
       |
return.received
       |
return.inspection.completed
       |
return.refund.approved
       |
return.refund.processing
       |
payment provider confirmation
       |
return.refund.succeeded
       |
return.completed


return.refund.succeeded must only be emitted after confirmed successful execution.

12.3 Webhook reliability

Implement:

Transactional outbox pattern.
Idempotent event consumers.
Event delivery retries.
Duplicate event protection.
Signature verification for inbound provider webhooks.
Event timestamps.
Delivery attempt tracking.
Failed-event reconciliation.
Dead-letter handling.

Inbound payment provider webhooks must be verified before updating refund state.

The system must tolerate duplicate and out-of-order webhook delivery.

13. API and Service Boundaries
13.1 Return service

lib/server/commerce/returns/service.ts

ts
export async function createReturnRequest(): Promise<Return>;

export async function authorizeReturn(): Promise<Return>;

export async function rejectReturn(): Promise<Return>;

export async function cancelReturn(): Promise<Return>;

export async function receiveReturn(): Promise<Return>;

export async function completeInspection(): Promise<Return>;

export async function getReturnById(): Promise<Return>;

export async function listReturns(): Promise<Return[]>;


Actual implementations must use validated input DTOs rather than accepting unvalidated objects.

13.2 Refund service

lib/server/commerce/returns/refund.ts

ts
export async function approveRefund(): Promise<Refund>;

export async function executeRefund(): Promise<Refund>;

export async function reconcileRefund(): Promise<Refund>;

export async function handleRefundWebhook(): Promise<void>;

13.3 Inspection service

lib/server/commerce/returns/inspection.ts

ts
export async function startInspection(): Promise<ReturnInspection>;

export async function recordInspectionFindings(): Promise<ReturnInspection>;

export async function finalizeInspection(): Promise<ReturnInspection>;

13.4 RMA service

lib/server/commerce/returns/rma.ts

ts
export async function generateRMA(): Promise<RMA>;

export async function updateRMATracking(): Promise<RMA>;

export async function markRMAReceived(): Promise<RMA>;

export async function closeRMA(): Promise<RMA>;


All operations must enforce authorization, state transition validation, and transaction integrity.

14. Dashboard and Customer Experience
14.1 Franchisee returns queue

Path:

app/dashboard/commerce/returns/page.tsx

The queue must support:

Search by return number.
Search by order number.
Filter by return status.
Filter by date.
Filter by customer.
Filter by inspection status.
Filter by refund status.
Filter by product.
Filter by RMA tracking status.

Display:

Column	Description
Return number	Unique return identifier
Order	Original order
Customer	Customer identity
Requested date	Request timestamp
Items	Number of returned items
Amount	Requested refund
Status	Current return status
Inspection	Inspection state
Refund	Refund state
14.2 Return detail and RMA queue

Path:

app/dashboard/commerce/returns/[returnId]/page.tsx

The detail view must contain:

Return overview.
Original order details.
Customer information.
Returned items and quantities.
Return reason.
RMA details.
Shipping and tracking.
Inspection checklist.
Inspection evidence.
Refund calculation.
Contract responsibility breakdown.
Refund execution status.
Complete audit timeline.

The interface must expose only actions permitted by the current return state and operator permissions.

14.3 Customer account

Customers must be able to:

Request a return.
Select eligible items.
Specify quantities.
Provide return reasons.
Submit supporting evidence.
View authorization status.
Access RMA instructions.
Submit tracking details where applicable.
Track inspection progress.
View refund processing status.
View completed refund information.

Customers must not see internal franchisee/franchisor settlement allocations.

15. Notifications

Notifications must be triggered by domain events.

Event	Recipient
Return requested	Customer and franchisee
Return authorized	Customer
Return rejected	Customer
RMA issued	Customer
Return received	Customer
Inspection completed	Customer and franchisee
Refund approved	Customer
Refund processing	Customer
Refund succeeded	Customer
Refund failed	Customer and franchisee
Exceptional responsibility override	Relevant authorized operators

Notifications must be asynchronous and must not compromise transaction processing.

16. Security and Authorization

All return and refund operations must enforce:

Tenant isolation.
Franchise ownership checks.
Customer order ownership.
Role-based authorization.
Server-side state transition validation.
Input validation.
Evidence access control.
Payment transaction ownership.
Audit logging.

Franchisees must not access another franchisee's returns.

Customers must not access another customer's return information.

Franchisors must not execute franchisee refunds merely because they have contract-level visibility.

Refund amounts must always be calculated and validated server-side.

17. Audit and Compliance

Every important operation must create an audit record.

ts
interface ReturnAuditEvent {
  id: string;

  returnId: string;

  actorId: string;
  actorType:
    | "CUSTOMER"
    | "FRANCHISEE"
    | "FRANCHISOR"
    | "SYSTEM";

  action: string;

  previousStatus?: string;
  newStatus?: string;

  metadata?: Record<string, unknown>;

  createdAt: Date;
}


Audit events must include:

Return creation.
Authorization.
Rejection.
Cancellation.
RMA generation.
Tracking changes.
Goods receipt.
Inspection start and completion.
Refund approval.
Refund execution attempts.
Refund success or failure.
Responsibility overrides.
Administrative interventions.

Sensitive payment credentials must never be stored in audit metadata.

18. Database Integrity and Transactions

The implementation must guarantee:

A return references a valid order.
Return items reference valid order items.
Return quantities cannot exceed remaining eligible quantities.
Each physical return has a unique RMA.
Each return has an immutable responsibility snapshot after authorization.
Refund execution is idempotent.
Refund totals cannot exceed eligible captured payment balances.
Refund success requires payment provider confirmation.
Audit records are persisted with corresponding domain transitions.
Concurrent return and refund operations cannot bypass quantity or financial limits.

Use database transactions and appropriate locking or atomic conditional updates for operations involving shared order balances.

Use a transactional outbox for reliable event publication.

19. Failure Handling
Scenario	Expected behavior
Invalid return request	Reject validation
Expired return window	Reject or require authorized exception
Duplicate return request	Prevent duplicate eligible quantities
RMA delivery failure	Keep return pending investigation
Inspection failure	Reject affected quantities with documented reasons
Partial inspection	Calculate refund from accepted quantities
Payment provider failure	Mark refund failed and allow controlled retry
Duplicate webhook	Process idempotently
Contract unavailable	Block authorization until responsibility is resolved
Contract changed after authorization	Preserve original snapshot
Franchisee payment account unavailable	Prevent refund execution and escalate
Refund exceeds remaining balance	Reject transaction
Notification failure	Retry independently without reversing return state
20. Operational Monitoring

Monitor the following metrics:

Total returns requested.
Return authorization rate.
Return rejection rate.
Average authorization time.
Average RMA transit time.
Average inspection completion time.
Average refund processing time.
Refund failure rate.
Outstanding inspection queue.
Outstanding refund queue.
Refund cost by franchisee.
Refund cost by franchisor.
Refund cost by responsibility type.
Outstanding reimbursement balances.

Alert operators when:

Returns remain uninspected beyond the configured SLA.
Refunds remain processing beyond the provider's expected timeframe.
Payment provider webhooks fail repeatedly.
Responsibility snapshots cannot be resolved.
Refund allocations fail financial reconciliation.
21. Testing Requirements
Unit tests
Return eligibility validation.
Return quantity validation.
State transition validation.
Responsibility resolution.
Split allocation calculations.
Currency rounding.
Partial return calculations.
Refund eligibility.
Idempotency behavior.
Integration tests
Customer return initiation.
Franchisee return initiation.
RMA generation.
Return receipt.
Inspection completion.
Refund approval.
Payment provider refund execution.
Refund webhook reconciliation.
Contract responsibility snapshot.
Franchisee/franchisor allocation.
Transaction rollback.
Concurrent refund prevention.
Authorization tests
Customer cannot return another customer's order.
Franchisee cannot manage another franchisee's return.
Franchisor cannot execute a franchisee refund without explicit authority.
Unauthorized operators cannot finalize inspections.
Unauthorized users cannot override refund responsibility.
End-to-end tests
Customer requests a return.
Franchisee authorizes the return.
RMA is generated.
Customer ships the product.
Franchisee receives the product.
Authorized operator inspects the product.
Inspection passes.
Refund is approved.
Franchisee executes the refund.
Payment provider confirms success.
Customer receives notification.
Internal responsibility allocation is recorded.
Return is marked completed.

Also test rejection, partial acceptance, failed refunds, duplicate webhooks, and concurrent requests.

22. Implementation Principles

The implementation must follow these architectural principles:

Single source of truth: The Return aggregate controls the return lifecycle.
Merchant of Record integrity: Franchisees execute customer refunds.
Contract-driven responsibility: Refund cost allocation comes from the applicable contract.
Mandatory inspection: Physical goods cannot be refunded before inspection completion.
Explicit state transitions: No arbitrary status updates.
Financial integrity: All monetary calculations use integer minor units.
Idempotent execution: Refunds cannot be accidentally duplicated.
Auditable decisions: All material operations are recorded.
Tenant isolation: Franchise boundaries are enforced server-side.
Event-driven integration: Notifications and external integrations consume reliable domain events.
Separation of concerns: Return authorization, inspection, refund execution, and financial settlement remain distinct operations.
23. Consequences
Positive
Establishes clear refund ownership.
Preserves franchisee Merchant of Record responsibilities.
Supports flexible franchise agreements.
Enables configurable refund cost allocation.
Prevents refunds before physical inspection.
Provides complete RMA tracking.
Supports partial returns and partial refunds.
Improves financial reconciliation.
Creates a traceable operational history.
Supports future expansion into centralized return logistics.
Trade-offs
Inspection introduces additional processing time.
RMA management adds operational complexity.
Contract snapshots require version-aware responsibility resolution.
Refund execution requires payment-provider reconciliation.
Partial returns require careful order-level financial accounting.
Outbox and idempotency infrastructure increase implementation complexity.

These trade-offs are accepted because financial integrity, operational accountability, and clear merchant-of-record ownership take precedence over immediate refund execution.

24. Acceptance Criteria

This ADR is considered fully implemented when:

Customers can initiate eligible returns through their accounts.
Franchisees can initiate returns through the dashboard.
Franchisees remain the refund-executing Merchant of Record.
Refund responsibility is configurable through franchise contracts.
Responsibility is snapshotted at authorization.
Split allocations support deterministic currency rounding.
Every physical return receives an RMA.
Return receipt is recorded.
Inspection is mandatory before physical merchandise refund approval.
Partial inspection and partial refunds are supported.
Refund execution is idempotent.
Refund success requires provider confirmation.
Refund webhooks are verified and processed idempotently.
Customer and franchisee dashboards are operational.
Refund responsibility allocations are auditable.
Tenant and role authorization is enforced.
Notifications are event-driven.
Integration and end-to-end tests pass.
Financial reconciliation is verified.
25. Final Decision

The platform adopts a franchisee-executed, contract-allocated, inspection-gated returns and refund architecture.

The customer or franchisee may initiate a return.

The franchisee remains responsible for executing the customer's refund as Merchant of Record.

The applicable franchise contract determines whether the franchisee, franchisor, or both absorb the refund cost.

All physical returns must pass through an RMA and mandatory inspection workflow before refund approval and execution.

Refund events are published only after confirmed payment-provider success.

This decision establishes the authoritative returns architecture for the commerce platform.