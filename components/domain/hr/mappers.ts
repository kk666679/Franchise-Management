export type EmployeeView = {
  id: string
  fullName: string
  email: string
  role: string
  branchName: string
  status: "active" | "inactive" | "on_leave"
  hiredAtIso: string
}

export type ShiftView = {
  id: string
  employeeName: string
  branchName: string
  startsAtIso: string
  endsAtIso: string
  role: string
}

export type AttendanceView = {
  id: string
  employeeName: string
  clockInIso: string
  clockOutIso: string | null
  status: "on_time" | "late" | "missing"
}

export type HrTaskView = {
  id: string
  title: string
  assigneeName: string
  dueDateIso: string | null
  status: "todo" | "in_progress" | "done"
}
