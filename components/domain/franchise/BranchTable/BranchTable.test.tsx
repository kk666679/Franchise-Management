import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { BranchTable } from './BranchTable'

it('renders branch rows', () => {
  render(
    <BranchTable
      data={[
        {
          id: 'b1',
          name: 'Downtown',
          franchiseName: 'Acme North',
          addressLine: '123 Main',
          city: 'Springfield',
          region: 'IL',
          isActive: true,
        },
      ]}
    />,
  )
  expect(screen.getByText('Downtown')).toBeTruthy()
  expect(screen.getByText('Springfield, IL')).toBeTruthy()
})

it('has no a11y violations', async () => {
  const { container } = render(<BranchTable data={[]} />)
  expect(await axe(container)).toHaveNoViolations()
})
