export type ApprovalDecisionDialogProps = {
  decision: "approved" | "rejected"
  triggerLabel: string
  onConfirm: (note: string) => Promise<void>
}
