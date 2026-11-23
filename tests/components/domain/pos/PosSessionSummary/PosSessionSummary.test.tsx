import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { PosSessionSummary } from './PosSessionSummary'

const session = { id: 's1', registerId: 'r1', openedAtIso: '2026-11-23T08:00:00.000Z', closedAtIso: null, openingFloatCents: 10000, closingTotalCents: null, currency: 'USD' }

it('renders session summary', () => {
  render(<PosSessionSummary session={session} />)
  expect(screen.getByText(/Session summary/)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<PosSessionSummary session={session} />)
  expect((await axe(container)).violations).toEqual([])
})
