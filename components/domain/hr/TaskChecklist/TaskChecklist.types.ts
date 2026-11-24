export type TaskChecklistItem = { id: string; label: string; done: boolean }
export type TaskChecklistProps = {
  items: TaskChecklistItem[]
  onToggle: (id: string, done: boolean) => void
}
