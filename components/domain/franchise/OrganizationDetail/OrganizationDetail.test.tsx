import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { OrganizationDetail } from './OrganizationDetail'

const org = {
  id: 'o1', name: 'Acme Inc', legalName: 'Acme Holdings LLC', status: 'active' as const,
  franchiseCount: 4, branchCount: 12, createdAtIso: '2025-01-01T00:00:00.000Z',
}

it('renders organization fields', () => {
  render(<OrganizationDetail organization={org} />)
  expect(screen.getByRole('heading', { name: 'Acme Inc' })).toBeInTheDocument()
  expect(screen.getByText('Acme Holdings LLC')).toBeInTheDocument()
  expect(screen.getByText('4')).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<OrganizationDetail organization={org} />)
  expect(await axe(container)).toHaveNoViolations()
})
