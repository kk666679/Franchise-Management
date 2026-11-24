import { Card } from "@/components/ui/card"
import type { TaskListProps } from "./TaskList.types"

export function TaskList({ tasks }: TaskListProps) {
  return (
    <Card className="space-y-3 p-4">
      <h3 className="font-semibold">Tasks</h3>
      {tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">No tasks.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between text-sm"
            >
              <span>{t.title}</span>
              <span className="text-muted-foreground">{t.status}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
