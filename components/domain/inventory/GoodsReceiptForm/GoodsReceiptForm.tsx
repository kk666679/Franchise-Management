"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type {
  GoodsReceiptFormProps,
  GoodsReceiptFormValues,
} from "./GoodsReceiptForm.types"

export function GoodsReceiptForm({
  onSubmit,
  onCancel,
}: GoodsReceiptFormProps) {
  const [values, setValues] = useState<GoodsReceiptFormValues>({
    purchaseOrderId: "",
    receivedQty: 0,
    reference: "",
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
        <Label htmlFor="gr-po">Purchase order ID</Label>
        <Input
          id="gr-po"
          value={values.purchaseOrderId}
          onChange={(e) =>
            setValues({ ...values, purchaseOrderId: e.target.value })
          }
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="gr-qty">Received quantity</Label>
        <Input
          id="gr-qty"
          type="number"
          min={0}
          value={values.receivedQty}
          onChange={(e) =>
            setValues({ ...values, receivedQty: Number(e.target.value) })
          }
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="gr-ref">Reference</Label>
        <Input
          id="gr-ref"
          value={values.reference ?? ""}
          onChange={(e) => setValues({ ...values, reference: e.target.value })}
        />
      </div>
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">Record receipt</Button>
      </div>
    </form>
  )
}
