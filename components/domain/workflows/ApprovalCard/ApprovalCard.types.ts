import type { ApprovalView } from "../mappers"

export type ApprovalCardProps = {
  approval: ApprovalView
  onDecision?: (id: string, decision: "approved" | "rejected") => Promise<void>
}
