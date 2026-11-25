"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { PosCartItemView } from "../types"

export type PosCoursePanelProps = {
  items: PosCartItemView[]
  onMove: (itemId: string, course: "starter" | "main" | "dessert" | "beverage") => void
}

const courses: Array<{ key: "starter" | "main" | "dessert" | "beverage"; label: string }> = [
  { key: "starter", label: "Starters" },
  { key: "main", label: "Mains" },
  { key: "dessert", label: "Desserts" },
  { key: "beverage", label: "Beverages" },
]

export function PosCoursePanel({ items, onMove }: PosCoursePanelProps) {
  return (
    <Card className="space-y-4 p-4">
      <h3 className="font-semibold">Courses</h3>
      {courses.map((course) => {
        const courseItems = items.filter((i) => i.course === course.key)
        return (
          <section key={course.key} aria-label={course.label} className="space-y-2">
            <h4 className="text-sm font-medium">{course.label}</h4>
            {courseItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">No items.</p>
            ) : (
              <ul className="space-y-1">
                {courseItems.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-2 text-sm">
                    <span>{item.name}</span>
                    <div className="flex gap-1">
                      {courses.filter((c) => c.key !== course.key).map((c) => (
                        <Button key={c.key} size="sm" variant="ghost" onClick={() => onMove(item.id, c.key)}>
                          {c.label.slice(0, 1)}
                        </Button>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )
      })}
    </Card>
  )
}
