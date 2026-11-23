import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { TerritoryConflictBadge } from './TerritoryConflictBadge'

it('renders conflict label and aria-label', () => {
  render(<TerritoryConflictBadge />)
  expect(screen.getByLabelText(/territory conflict/i)).toBeTruthy()
})

it('has no a11y violations', async () => {
  const { container } = render(<TerritoryConflictBadge />)
  expect(await axe(container)).toHaveNoViolations()
})
