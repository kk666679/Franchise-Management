import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { OrganizationTable } from './OrganizationTable'

it('renders organization rows', () => {
  render(
    <OrganizationTable
      data={[
        { id: 'o1', name: 'Acme Inc', legalName: 'Acme Holdings LLC', status: 'active', franchiseCount: 4, branchCount: 12, createdAtIso: '2025-01-01T00:00:00.000Z' },
      ]}
    />,
  )
  expect(screen.getByText('Acme Inc')).toBeInTheDocument()
  expect(screen.getByText('Acme Holdings LLC')).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<OrganizationTable data={[]} />)
  expect(await axe(container)).toHaveNoViolations()
})
