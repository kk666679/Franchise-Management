import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { PosTender } from './PosTender'

it('renders tender buttons', () => {
  render(<PosTender items={[]} onTender={async () => {}} />)
  expect(screen.getByRole('button', { name: 'Cash' })).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Card' })).toBeDisabled()
})

it('has no a11y violations', async () => {
  const { container } = render(<PosTender items={[]} onTender={async () => {}} />)
  expect(await axe(container)).toHaveNoViolations()
})
