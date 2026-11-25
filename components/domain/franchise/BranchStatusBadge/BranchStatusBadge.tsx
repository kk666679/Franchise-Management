import { Badge } from '@/components/ui/badge'

export function BranchStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge variant={isActive ? 'default' : 'outline'} aria-label={isActive ? 'Branch active' : 'Branch inactive'}>
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  )
}
