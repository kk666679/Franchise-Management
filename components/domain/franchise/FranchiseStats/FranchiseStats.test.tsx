import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { FranchiseStats } from './FranchiseStats'

const franchise = {
  id: 'f1', name: 'Acme North', legalName: 'Acme North LLC', status: 'active' as const,
  organizationName: 'Acme Inc', territoryName: 'North', branchCount: 3,
  createdAtIso: '2025-01-15T00:00:00.000Z',
}

it('renders stats', () => {
  render(<FranchiseStats franchise={franchise} activeBranches={2} expiringContracts={1} />)
  expect(screen.getByText('Active branches')).toBeInTheDocument()
  expect(screen.getByText('Expiring contracts')).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<FranchiseStats franchise={franchise} activeBranches={2} expiringContracts={0} />)
  expect(await axe(container)).toHaveNoViolations()
})
