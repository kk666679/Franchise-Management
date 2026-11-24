"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ProductFormProps, ProductFormValues } from "./ProductForm.types"

export function ProductForm({ initial, onSubmit, onCancel }: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>({
    name: initial?.name ?? "",
    sku: initial?.sku ?? "",
    category: initial?.category ?? "",
    unitPriceCents: initial?.unitPriceCents ?? 0,
    currency: initial?.currency ?? "USD",
  })
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        void onSubmit(values)
      }}
    >
      <div className="space-y-1.5">
        <Label htmlFor="product-name">Name</Label>
        <Input
          id="product-name"
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="product-sku">SKU</Label>
        <Input
          id="product-sku"
          value={values.sku}
          onChange={(e) => setValues({ ...values, sku: e.target.value })}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="product-category">Category</Label>
        <Input
          id="product-category"
          value={values.category}
          onChange={(e) => setValues({ ...values, category: e.target.value })}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="product-price">Unit price (cents)</Label>
        <Input
          id="product-price"
          type="number"
          min={0}
          value={values.unitPriceCents}
          onChange={(e) =>
            setValues({ ...values, unitPriceCents: Number(e.target.value) })
          }
        />
      </div>
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">Save product</Button>
      </div>
    </form>
  )
}
