import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { BranchDetail } from './BranchDetail'

const branch = {
  id: 'b1', name: 'Downtown', franchiseName: 'Acme North',
  addressLine: '123 Main St', city: 'Springfield', region: 'IL', isActive: true,
}

it('renders branch fields', () => {
  render(<BranchDetail branch={branch} />)
  expect(screen.getByRole('heading', { name: 'Downtown' })).toBeInTheDocument()
  expect(screen.getByText('123 Main St')).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<BranchDetail branch={branch} />)
  expect(await axe(container)).toHaveNoViolations()
})
