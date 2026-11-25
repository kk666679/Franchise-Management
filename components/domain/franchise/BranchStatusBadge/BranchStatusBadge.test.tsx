import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { BranchStatusBadge } from './BranchStatusBadge'

it('renders active', () => {
  render(<BranchStatusBadge isActive />)
  expect(screen.getByLabelText(/branch active/i)).toBeInTheDocument()
})

it('renders inactive', () => {
  render(<BranchStatusBadge isActive={false} />)
  expect(screen.getByLabelText(/branch inactive/i)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<BranchStatusBadge isActive />)
  expect(await axe(container)).toHaveNoViolations()
})
