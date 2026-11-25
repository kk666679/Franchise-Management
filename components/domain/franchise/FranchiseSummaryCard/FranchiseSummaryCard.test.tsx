import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { FranchiseSummaryCard } from './FranchiseSummaryCard'

const franchise = {
  id: 'f1', name: 'Acme North', legalName: 'Acme North LLC', status: 'active' as const,
  organizationName: 'Acme Inc', territoryName: 'North', branchCount: 3,
  createdAtIso: '2025-01-15T00:00:00.000Z',
}

it('renders franchise summary', () => {
  render(<FranchiseSummaryCard franchise={franchise} />)
  expect(screen.getByText('Acme North')).toBeInTheDocument()
  expect(screen.getByText('Acme Inc')).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<FranchiseSummaryCard franchise={franchise} />)
  expect(await axe(container)).toHaveNoViolations()
})
