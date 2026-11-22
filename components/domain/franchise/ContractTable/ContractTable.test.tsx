import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ContractTable } from './ContractTable'

it('renders contract rows', () => {
  render(
    <ContractTable
      data={[
        {
          id: 'c1',
          franchiseName: 'Acme North',
          status: 'active',
          effectiveFromIso: '2025-01-01T00:00:00.000Z',
          effectiveToIso: null,
          royaltyRatePct: 5,
        },
      ]}
    />,
  )
  expect(screen.getByText('Acme North')).toBeInTheDocument()
  expect(screen.getByText('5%')).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<ContractTable data={[]} />)
  expect(await axe(container)).toHaveNoViolations()
})
