export type ComplianceView = {
  id: string
  title: string
  category: string
  status: 'compliant' | 'pending' | 'overdue' | 'waived'
  ownerName: string
  dueDateIso: string | null
  lastReviewedIso: string | null
}

export type ComplianceEvidenceView = {
  id: string
  complianceId: string
  fileName: string
  uploadedAtIso: string
  uploadedBy: string
}
