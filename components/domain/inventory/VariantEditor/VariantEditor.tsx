"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import type { VariantEditorProps, VariantRow } from "./VariantEditor.types"

export function VariantEditor({ variants, onChange }: VariantEditorProps) {
  const [rows, setRows] = useState<VariantRow[]>(variants)
  function update(next: VariantRow[]) {
    setRows(next)
    onChange(next)
  }
  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Variants</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            update([...rows, { id: crypto.randomUUID(), name: "", sku: "" }])
          }
        >
          Add variant
        </Button>
      </div>
      <ul className="space-y-2">
        {rows.map((r, i) => (
          <li key={r.id} className="flex gap-2">
            <Input
              aria-label={`Variant ${i + 1} name`}
              placeholder="Name"
              value={r.name}
              onChange={(e) =>
                update(
                  rows.map((x) =>
                    x.id === r.id ? { ...x, name: e.target.value } : x
                  )
                )
              }
            />
            <Input
              aria-label={`Variant ${i + 1} SKU`}
              placeholder="SKU"
              value={r.sku}
              onChange={(e) =>
                update(
                  rows.map((x) =>
                    x.id === r.id ? { ...x, sku: e.target.value } : x
                  )
                )
              }
            />
            <Button
              variant="ghost"
              onClick={() => update(rows.filter((x) => x.id !== r.id))}
            >
              Remove
            </Button>
          </li>
        ))}
        {rows.length === 0 && (
          <li className="text-sm text-muted-foreground">No variants.</li>
        )}
      </ul>
    </Card>
  )
}
