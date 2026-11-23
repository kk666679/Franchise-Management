import type { PosCartItemView } from '../mappers'

export type PosTenderProps = {
  items: PosCartItemView[]
  onTender: (method: 'cash' | 'card') => Promise<void>
}
