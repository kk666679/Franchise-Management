import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { OrganizationStatusBadge } from './OrganizationStatusBadge'

it.each(['active', 'suspended', 'terminated'] as const)('renders %s', (s) => {
  render(<OrganizationStatusBadge status={s} />)
  expect(screen.getByLabelText(/organization status:/i)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<OrganizationStatusBadge status="active" />)
  expect(await axe(container)).toHaveNoViolations()
})
