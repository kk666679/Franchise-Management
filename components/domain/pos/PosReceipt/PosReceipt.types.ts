export type PosReceiptLine = {
  id: string
  name: string
  quantity: number
  totalCents: number
}
export type PosReceiptView = {
  receiptNumber: string
  currency: string
  totalCents: number
  lines: PosReceiptLine[]
}
export type PosReceiptProps = { receipt: PosReceiptView }
