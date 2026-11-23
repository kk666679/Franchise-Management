export type ApprovalView = {
  id: string
  title: string
  requesterName: string
  status: 'pending' | 'approved' | 'rejected'
  createdAtIso: string
  summary: string
}

export type ApprovalStepView = {
  id: string
  label: string
  status: 'pending' | 'active' | 'done' | 'rejected'
  actorName: string | null
  actedAtIso: string | null
}
