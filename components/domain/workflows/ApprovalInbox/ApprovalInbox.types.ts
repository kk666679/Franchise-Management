import type { ApprovalView } from '../mappers'

export type ApprovalInboxProps = { approvals: ApprovalView[]; onDecision?: (id: string, decision: 'approved' | 'rejected') => Promise<void> }
