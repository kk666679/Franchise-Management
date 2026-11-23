import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { FranchiseDetail } from './FranchiseDetail'
import type { FranchiseView } from '../mappers'

const franchise: FranchiseView = {
  id: 'f1',
  name: 'Acme North',
  legalName: 'Acme North LLC',
  status: 'active',
  organizationName: 'Acme Inc',
  territoryName: 'North Region',
  branchCount: 3,
  createdAtIso: '2025-01-15T00:00:00.000Z',
}

it('renders all fields', () => {
  render(<FranchiseDetail franchise={franchise} />)
  expect(screen.getByRole('heading', { name: 'Acme North' })).toBeTruthy()
  expect(screen.getByText('Acme Inc')).toBeTruthy()
  expect(screen.getByText('North Region')).toBeTruthy()
  expect(screen.getByText('3')).toBeTruthy()
})

it('has no a11y violations', async () => {
  const { container } = render(<FranchiseDetail franchise={franchise} />)
  expect(await axe(container)).toHaveNoViolations()
})
