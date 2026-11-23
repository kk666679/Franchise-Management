import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ContractLifecycleBadge } from './ContractLifecycleBadge'

it.each([
  'draft',
  'pending_approval',
  'active',
  'renewal',
  'terminated',
] as const)('renders %s', (s) => {
  render(<ContractLifecycleBadge status={s} />)
  expect(screen.getByLabelText(/contract status:/i)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<ContractLifecycleBadge status="active" />)
  expect((await axe(container)).violations).toEqual([])
})
