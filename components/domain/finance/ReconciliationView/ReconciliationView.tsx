import { Card } from '@/components/ui/card'
import type { ReconciliationViewProps } from './ReconciliationView.types'

export function ReconciliationView({ items }: ReconciliationViewProps) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3">Reconciliation</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reconciliation items.</p>
      ) : (
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li key={item.id} className="py-2 flex items-center justify-between text-sm">
              <span>{item.label}</span>
              <span className={item.matched ? 'text-green-600' : 'text-amber-600'}>{item.matched ? 'Matched' : 'Unmatched'}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
