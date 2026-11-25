import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ContractDetail } from './ContractDetail'

const contract = {
  id: 'c1', franchiseName: 'Acme North', status: 'active' as const,
  effectiveFromIso: '2025-01-01T00:00:00.000Z', effectiveToIso: null, royaltyRatePct: 5,
}

it('renders contract fields', () => {
  render(<ContractDetail contract={contract} events={[]} />)
  expect(screen.getByText('5%')).toBeInTheDocument()
  expect(screen.getByText(/open-ended/i)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<ContractDetail contract={contract} events={[]} />)
  expect(await axe(container)).toHaveNoViolations()
})
