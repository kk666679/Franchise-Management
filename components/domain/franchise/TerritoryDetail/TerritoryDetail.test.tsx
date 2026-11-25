import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { TerritoryDetail } from './TerritoryDetail'

it('renders assigned territory', () => {
  render(<TerritoryDetail territory={{ id: 't1', name: 'North', region: 'NA', franchiseName: 'Acme', hasConflict: false }} />)
  expect(screen.getByText('Acme')).toBeInTheDocument()
})

it('shows conflict badge', () => {
  render(<TerritoryDetail territory={{ id: 't1', name: 'North', region: 'NA', franchiseName: 'Acme', hasConflict: true }} />)
  expect(screen.getByLabelText(/territory conflict/i)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<TerritoryDetail territory={{ id: 't1', name: 'North', region: 'NA', franchiseName: null, hasConflict: false }} />)
  expect(await axe(container)).toHaveNoViolations()
})
