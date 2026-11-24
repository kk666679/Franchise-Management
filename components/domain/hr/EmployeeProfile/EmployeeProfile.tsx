import { Card } from "@/components/ui/card"
import type { EmployeeProfileProps } from "./EmployeeProfile.types"

export function EmployeeProfile({ employee }: EmployeeProfileProps) {
  return (
    <Card className="space-y-3 p-4">
      <h2 className="text-lg font-semibold">{employee.fullName}</h2>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-muted-foreground">Email</dt>
          <dd>{employee.email}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Role</dt>
          <dd>{employee.role}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Branch</dt>
          <dd>{employee.branchName}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Status</dt>
          <dd>{employee.status}</dd>
        </div>
      </dl>
    </Card>
  )
}
