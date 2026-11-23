import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { EmployeeForm } from './EmployeeForm'

it('renders form', () => {
  render(<EmployeeForm onSubmit={async () => {}} />)
  expect(screen.getByLabelText(/Full name/i)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<EmployeeForm onSubmit={async () => {}} />)
  expect(await axe(container)).toHaveNoViolations()
})
